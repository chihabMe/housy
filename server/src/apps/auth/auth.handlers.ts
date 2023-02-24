import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../../core/constants";
import redis_client from "../../core/redis_clinet";
import { loginSchema } from "../../lib/schemas/auth/login.schemas";
import { generateAuthTokens, setAuthCookies } from "./auth.services";

export const obtainTokenHandler = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  const tokens = generateAuthTokens("asdsa");
  redis_client.set("hi", "hello");
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
