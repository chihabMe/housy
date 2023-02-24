import { Request, Response, NextFunction } from "express";
import { TypeOf } from "zod";
import httpStatus from "http-status";
import { registrationSchema } from "../../lib/schemas/auth/registration.schemas";
import prisma from "../../core/prisma";
import { hasher } from "../../lib/hasher";
export const accountsRegisterHandler = async (
  req: Request<{}, {}, TypeOf<typeof registrationSchema>>,
  res: Response,
  next: NextFunction
) => {
  const { email, password, username } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hasher(password),
      },
    });
    res
      .status(httpStatus.CREATED)
      .json({ username: user.username, email: user.email });
  } catch (err) {
    next(err);
  }
};
export const accountsMeHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("me");
};
export const accountsDeleteHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("delete");
};
export const accountsActivateHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("activation");
};

export const accountsUpdateProfileHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("update profile");
};

export const accountsChangePassword = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("change password");
};
export const accountsChangeEmailHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("change email");
};
export const accountsRestorePasswordHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("restore password");
};
