import { Request, Response, NextFunction } from "express";
import { TypeOf } from "zod";
import httpStatus from "http-status";
import { hasher } from "../../libs/hasher";
import crypto from "crypto";
import { User } from "@prisma/client";
import { sendAccountActivationEmail, sendMail } from "../../libs/email";
import redis_client from "../../core/redis_client";
import {
  compareUserPassword,
  generateActivationEmail,
  generateActivationURI,
  storeThatThisUserAskedForAToken,
} from "./accounts.services";
import { generateCanRequestAnotherTokenRedisKey } from "../../libs/helpers/activation";
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
  findUserByEmailInterector,
  getLastGeneratedTokenFromAUser,
  updateUserInteractor,
} from "./accounts.interactors";
import { passwordChangeSchema, registrationSchema } from "./accounts.schemas";
import jsonRepose from "../../libs/jsonResponse";
export const accountsRegisterHandler = async (
  req: Request<{}, {}, TypeOf<typeof registrationSchema>>,
  res: Response,
  next: NextFunction
) => {
  //extracting the registration fields
  //(this route is being validated by zod validator middleware)
  //so those values are insured to be  stored in the req.body
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
    try {
      await sendAccountActivationEmail({
        subject: "account activation email",
        html: generateActivationEmail({ activationURI }),
        to: email,
      });
    } catch (err) {
      console.log("can't send an email");
    }
    //to store the use for asking many activation links in a short time
    // await storeThatThisUserAskedForAToken(user.id);
    storeThatThisUserAskedForAToken(user.id);

    //return success status and the user data
    res.status(httpStatus.CREATED).json(
      jsonRepose.success({
        message: "please check your email for the activation link",
      })
    );
  } catch (err) {
    //pass the error to the 500 errors handler middleware

    next(err);
  }
};
export const accountsMeHandler = (req: Request, res: Response) => {
  //@ts-ignore
  const user = { ...(req.user as User) };
  const { createdAt, email, id, updatedAt, username } = user;
  res.status(httpStatus.OK).json(
    jsonRepose.success({
      message: "user data",
      data: { username, id, updatedAt, createdAt, email },
    })
  );
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

    res.status(httpStatus.OK).json(jsonRepose.success({ message: "deleted" }));
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
    return res
      .status(httpStatus.BAD_REQUEST)
      .json(jsonRepose.error({ message: "invalid token" }));
  try {
    //get the user by using the activation token
    const token = await findTokenByToken(activationToken);
    if (!token)
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(jsonRepose.error({ message: "invalid token" }));
    if (Date.now() > token.expiresAt)
      res
        .status(httpStatus.BAD_REQUEST)
        .json(jsonRepose.error({ message: "dead token token" }));
    //update the user to be active and verified
    await updateUserInteractor({
      userId: token.userId,
      active: true,
      verified: true,
    });
    //delete the activationToken
    await deleteTokenById(token.id);
    //return success response
    // activated successfully
    return res.redirect("http://localhost:3000/accounts/activate-success");
    // return res
    //   .status(httpStatus.OK)
    //   .json(jsonRepose.success({ message: "activated please try to login" }));
  } catch (err) {
    next(err);
  }
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
    return res.status(httpStatus.BAD_REQUEST).json(
      jsonRepose.error({
        message: "invalid credentials",
        errors: {
          oldPassword: ["Invalid"],
        },
      })
    );
  //update the user with the hash of the new password
  await updateUserInteractor({
    userId: user.id,
    password: hasher(newPassword),
  });
  //return success response
  res.status(httpStatus.OK).json(
    jsonRepose.success({
      message: "your password has been changed",
    })
  );
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
    const email = req.body.email;
    const user = await findUserByEmailInterector(email);
    //to protect the api from exposing the registered users
    //i will alway return a success response
    if (!user || user.active)
      return res.status(200).json(
        jsonRepose.success({
          message: "please check your email for the activation link",
        })
      );
    const canGenerateAnotherToken = await redis_client.get(
      generateCanRequestAnotherTokenRedisKey(user.id)
    );
    const lastGeneratedToken = await getLastGeneratedTokenFromAUser(user.id);
    let now = new Date().getTime();
    if (now - lastGeneratedToken.createdAt.getTime() < TOKEN_EXPIRES_TIME)
      return res.status(httpStatus.BAD_REQUEST).json(
        jsonRepose.error({
          message:
            "you asked for an email before please wait 15 mins and try that again",
        })
      );
    //generate a token for the  user to activate his email
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
    try {
      //send the token as a  confirmation email to the user
      await sendAccountActivationEmail({
        subject: "account activation email",
        html: generateActivationEmail({ activationURI }),
        to: user.email,
      });
    } catch (err) {}

    res.status(httpStatus.OK).json(
      jsonRepose.success({
        message: "please check your email for the activation link",
      })
    );
  } catch (err) {
    next(err);
  }
};

export const accountsUpdateProfileHandler = async (
  req: Request<{}, {}, { username?: string }>,
  res: Response
) => {
  //@ts-ignore
  const user = req.user as User;
  const { username } = req.body;

  const updatedUser = await updateUserInteractor({
    userId: user.id,
    username,
  });
  res.status(httpStatus.OK).json(
    jsonRepose.success({
      message: "updated",
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    })
  );
};
