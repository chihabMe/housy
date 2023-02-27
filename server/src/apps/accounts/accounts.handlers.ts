import { Request, Response, NextFunction } from "express";
import { TypeOf } from "zod";
import httpStatus from "http-status";
import prisma from "../../core/prisma";
import { hasher } from "../../libs/hasher";
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
  generateActivationTokenAndStoreItInRedis,
  generateActivationURI,
  getUserIdFromRedisUsingTheActionToken,
  invalidateTheActivationToken,
} from "./accounts.services";
import {
  generateCanRequestAnotherTokenRedisKey,
  prefixActivationToken,
} from "../../libs/helpers/activation";
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
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hasher(password),
      },
    });
    //generate activation token
    const activationToken = await generateActivationTokenAndStoreItInRedis({
      userId: user.id,
    });
    //generate an activation uri that contains the generated token
    // http(s)://..../activate/{token}
    const activationURI = generateActivationURI({
      host: req.headers.host ?? "",
      token: activationToken,
    });
    console.log(activationURI);
    //send the token as a  confirmation email to the user
    sendAccountActivationEmail({
      subject: "account activation email",
      html: generateActivationEmail({ activationURI }),
      to: email,
    });
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
export const accountsDeleteHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("delete");
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
  //get the userId from redis by
  //using the activationToken prefixed by activation-token-
  //as a value to the userId
  const userId = await getUserIdFromRedisUsingTheActionToken(activationToken);
  //if userId is null return 400 error with message
  if (!userId) return res.status(httpStatus.BAD_REQUEST).json("invalid token");
  //update the user to be active and verified
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      active: true,
      verified: true,
    },
  });
  //delete the activationToken from redis
  await invalidateTheActivationToken(activationToken);
  //return success response
  return res.status(httpStatus.OK).json("activated");
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
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hasher(newPassword),
    },
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

// export const accountsActivateHandler = async (
//   req: Request<{ token: string }>,
//   res: Response,
//   next: NextFunction
// ) => {
//   const reqToken = req.params.token;
//   console.log(reqToken);
//   try {
//     const time = Date.now();
//     const token = await prisma.token.findFirst({
//       where: {
//         token: reqToken,
//       },
//     });
//     if (!token || !token.active || Date.now() > token.expiresAt)
//       return res.status(httpStatus.BAD_REQUEST).json("invalid token");
//     await prisma.user.update({
//       where: {
//         id: token.userId,
//       },
//       data: {
//         verified: true,
//         active: true,
//       },
//       select: {
//         id: true,
//       },
//     });
//     await prisma.token.update({
//       where: {
//         id: token.id,
//       },
//       data: {
//         active: false,
//       },
//     });
//     console.log("it took", Date.now() - time);
//     res.status(httpStatus.OK).json("activated");
//   } catch (err) {
//     next(err);
//   }
// };

export const generateAccountActivationEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const user = req.user as User;
    if (user.verified)
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
    const activationToken = await generateActivationTokenAndStoreItInRedis({
      userId: user.id,
    });
    //generate an activation uri that contains the generated token
    // http(s)://..../activate/{token}
    const activationURI = generateActivationURI({
      host: req.headers.host ?? "",
      token: activationToken,
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
