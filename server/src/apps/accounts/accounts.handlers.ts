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
import bcrypt from "bcrypt";
import crypt from "crypto";
import { sendAccountActivationEmail, sendMail } from "../../libs/email";
import { TOKEN_EXPIRES_TIME } from "../../core/constants";
import env from "../../core/env";
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
    //save the user in the database
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hasher(password),
      },
    });
    const token = await prisma.token.create({
      data: {
        userId: user.id,
        expiresAt: new Date(TOKEN_EXPIRES_TIME),
        token: crypt.randomBytes(16).toString("hex"),
      },
    });
    //send confirmation email to the user email
    const confirmRoute = `${env.isProduction() ? "https" : "http"}://${
      req.headers.host
    }/api/v1/accounts/activate/${token.token}`;
    const html = `
    <a href=${confirmRoute}>
    ${confirmRoute}
    </a>
    `;
    sendAccountActivationEmail({
      subject: "account activation email",
      html,
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
  const { createdAt, email, id, updatedAt, username, verified } = user;
  res.status(httpStatus.OK).json({ username, id, updatedAt, createdAt, email });
};
export const accountsDeleteHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("delete");
};
export const accountsActivateHandler = (
  req: Request<{ token: string }>,
  res: Response
) => {
  const token = req.params.token;
  console.log(token);
  res.status(httpStatus.OK).json("activation");
};

export const accountsUpdateProfileHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("update profile");
};

export const accountsChangePassword = async (
  req: Request<{}, {}, TypeOf<typeof passwordChangeSchema>>,
  res: Response
) => {
  const body = req.body;
  //@ts-ignore
  const user = req.user as User;
  if (!bcrypt.compareSync(body.oldPassword, user.password))
    return res.status(httpStatus.BAD_REQUEST).json("invalid user password");
  const password = hasher(body.newPassword);
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password,
    },
  });
  res.status(httpStatus.OK).json("your password has been changed");
};
export const accountsChangeEmailHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("change email");
};
export const accountsRestorePasswordHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("restore password");
};
