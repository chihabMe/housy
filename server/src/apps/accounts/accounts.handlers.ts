import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const accountsRegisterHandler = (req: Request, res: Response) => {
  res.status(httpStatus.CREATED).json("created");
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
