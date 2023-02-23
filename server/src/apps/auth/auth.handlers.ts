import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../../core/constants";
import { generateAuthTokens, setAuthCookies } from "./auth.services";

export const obtainTokenHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokens = generateAuthTokens("hihsdfsdf");
  setAuthCookies({
    res,
    access: tokens.accessToken,
    refresh: tokens.refreshToken,
  });
  return res.status(httpStatus.OK).json(tokens);
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
