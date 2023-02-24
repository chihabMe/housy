import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const obtainTokenHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(httpStatus.OK).json("jwt");
};
export const refreshTokenHandler = (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json("refresh");
};
export const verifyTokenHandler = (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json("verify");
};
export const logoutTokenHandler = (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json("logout");
};
