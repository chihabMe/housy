import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../../core/constants";
import prisma from "../../core/prisma";
import redis_client from "../../core/redis_clinet";
import { generateAuthTokens, setAuthCookies } from "./auth.services";
import bcrypt from "bcrypt";

export const obtainTokenHandler = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user || !bcrypt.compareSync(password, user.password))
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "invalid user credentials" });

  const tokens = generateAuthTokens(user.id);
  redis_client.set(user.id, tokens.refreshToken);
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
