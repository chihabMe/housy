import { Request, Response, NextFunction } from "express";
import { TypeOf } from "zod";
import httpStatus from "http-status";
import { registrationSchema } from "../../lib/schemas/auth/registration.schemas";
import prisma from "../../core/prisma";
export const accountsRegisterHandler = async (
  req: Request<{}, {}, TypeOf<typeof registrationSchema>>,
  res: Response
) => {
  const data = req.body;
  const user = await prisma.user.create({
    data,
  });

  res.status(httpStatus.CREATED).json({username:user.username,email:user.email});
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
