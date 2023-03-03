import { Request, Response, NextFunction } from "express";
import { TypeOf } from "zod";
import httpStatus from "http-status";
import { hasher } from "../../libs/hasher";
import crypto from "crypto";
import { User } from "@prisma/client";
import {
  passwordChangeSchema,
  registrationSchema,
} from "../../libs/schemas/accounts";
import { sendAccountActivationEmail, sendMail } from "../../libs/email";
import redis_client from "../../core/redis_clinet";
import {
  compareUserPassword,
  generateActivationEmail,
  generateActivationURI,
  storeThatThisUserAskedForAToken,
} from "./accounts.services";
import {
  generateCanRequestAnotherTokenRedisKey,
  prefixActivationToken,
} from "../../libs/helpers/activation";
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  TOKEN_EXPIRES_TIME,
} from "../../core/constants";
import {
  createTokenInteractor,
  createUserInteractor,
  deleteTokenById,
  findTokenByToken,
  updateUserInteractor,
} from "./accounts.interactors";
export const accountsRegisterHandler = async (
  req: Request<{}, {}, TypeOf<typeof registrationSchema>>,
  res: Response,
  next: NextFunction
) => {
  //(this route is being validated by zod validator middleware)
  //so those values are insured to be  stored in the req.body
  //extracting the registration fields
  const { email, password, username } = req.body;
  try {
    //create a user and store it in the database
    const user = await createUserInteractor({
      email,
      password: hasher(password),
      username,
    });
    //generate activation token
    const token = crypto.randomBytes(16).toString("hex");
    const activationToken = await createTokenInteractor({
      token,
      userId: user.id,
      expiresAt: Date.now() + TOKEN_EXPIRES_TIME,
    });
    //generate the activation uri
    // http(s)://..../activate/{token}
    const activationURI = generateActivationURI({
      host: req.headers.host ?? "",
      token: activationToken.token,
    });
    console.log(activationURI);
    //send the token as a  confirmation email to the user
    await sendAccountActivationEmail({
      subject: "account activation email",
      html: generateActivationEmail({ activationURI }),
      to: email,
    });
    //to store the use for asking many activation links in a short time
    await storeThatThisUserAskedForAToken(user.id);
    //return success status and the user data
    res
      .status(httpStatus.CREATED)
      .json({ username: user.username, email: user.email, id: user.id });
  } catch (err) {
    //pass the error to the 500 errors handler middleware
    next(err);
  }
};
export const accountsMeHandler = (req: Request, res: Response) => {
  //@ts-ignore
  const user = { ...(req.user as User) };
  const { createdAt, email, id, updatedAt, username } = user;
  res.status(httpStatus.OK).json({ username, id, updatedAt, createdAt, email });
};
export const accountsDeleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const user = req.user as User;
    await updateUserInteractor({
      userId: user.id,
      active: false,
    });
    //delete the stored refresh token from redis
    await redis_client.del(user.id);
    //delete the  authentication cookies
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.clearCookie(ACCESS_COOKIE_NAME);

    res.status(httpStatus.OK).json({ success: true, message: "deleted" });
  } catch (err) {
    next(err);
  }
};
export const accountsActivateHandler = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction
) => {
  //get the activation token from the params
  const activationToken = req.params.token;
  //if the activationToken is null return 400 error with message
  if (!activationToken)
    return res.status(httpStatus.BAD_REQUEST).json("invalid token");
  try {
    //get the user by using the activation token
    const token = await findTokenByToken(activationToken);
    if (!token) return res.status(httpStatus.BAD_REQUEST).json("invalid token");
    if (Date.now() > token.expiresAt)
      res.status(httpStatus.BAD_REQUEST).json("dead token token");
    //update the user to be active and verified
    await updateUserInteractor({
      userId: token.userId,
      active: true,
      verified: true,
    });
    //delete the activationToken
    await deleteTokenById(token.id);
    //return success response
    return res.status(httpStatus.OK).json("activated");
  } catch (err) {
    next(err);
  }
};

export const accountsUpdateProfileHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("update profile");
};

export const accountsChangePassword = async (
  req: Request<{}, {}, TypeOf<typeof passwordChangeSchema>>,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;
  //@ts-ignore
  const user = req.user as User;
  //validate the entered password and the user password
  if (!compareUserPassword({ password: oldPassword, hash: user.password }))
    return res.status(httpStatus.BAD_REQUEST).json("invalid user password");
  //update the user with the hash of the new password
  await updateUserInteractor({
    userId: user.id,
    password: hasher(newPassword),
  });
  //return success response
  res.status(httpStatus.OK).json("your password has been changed");
};
export const accountsChangeEmailHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("change email");
};
export const accountsRestorePasswordHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("restore password");
};

export const generateAccountActivationEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const user = req.user as User;
    if (user.active)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          "you are already verified you can't ask for a verification email"
        );
    const canGenerateAnotherToken = await redis_client.get(
      generateCanRequestAnotherTokenRedisKey(user.id)
    );
    //if the used asked for a token before
    //canGen... value wil be 1
    //i will return 400 error
    console.log("generate token", canGenerateAnotherToken);
    if (canGenerateAnotherToken == "1")
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          "you can't generate another token please try that again after 5 mins"
        );
    //generate a token for the  user to activate his email
    //and store it in redis
    const activationToken = await createTokenInteractor({
      expiresAt: Date.now() + TOKEN_EXPIRES_TIME,
      token: crypto.randomBytes(16).toString("hex"),
      userId: user.id,
    });
    //generate an activation uri that contains the generated token
    // http(s)://..../activate/{token}
    const activationURI = generateActivationURI({
      host: req.headers.host ?? "",
      token: activationToken.token,
    });
    console.log(activationURI);
    //send the token as a  confirmation email to the user
    sendAccountActivationEmail({
      subject: "account activation email",
      html: generateActivationEmail({ activationURI }),
      to: user.email,
    });

    res.status(httpStatus.OK).json("please check your email");
  } catch (err) {
    next(err);
  }
};
