import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "../../core/constants";
import prisma from "../../core/prisma";
import redis_client from "../../core/redis_clinet";
import {
  generateAuthTokens,
  setAuthCookies,
  validateAccessToken,
  validateRefreshToken,
} from "./auth.services";
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
  return res.status(httpStatus.OK).json({ status: "success" });
};
export const refreshTokenHandler = async (
  req: Request<{}, {}, { refresh: string }>,
  res: Response,
  next: NextFunction
) => {
  //get the refresh token from the header or the cookie
  const refresh = (req.headers[REFRESH_COOKIE_NAME] ||
    req.signedCookies[REFRESH_COOKIE_NAME]) as string;
  //decode the refresh token and return its values
  const decoded = validateRefreshToken(refresh);
  //if decoded ==null return an error
  if (!decoded)
    return res.status(httpStatus.BAD_REQUEST).json("invalid refresh token");
  //this try will handle if redis connection failed
  try {
    //get the stored refresh token form redis
    const currentStoredRefreshToken = await redis_client.get(decoded.user_id);
    //compare the relieved refresh token and the one stored in redis
    if (!currentStoredRefreshToken || refresh != currentStoredRefreshToken)
      //the refresh tokens are not the same thats mean the reviewed one is not whitelisted
      //return 400 bad request error and blacklisted token error
      return res
        .status(httpStatus.BAD_REQUEST)
        .json("blacklisted refresh token");
    //if the they are the same
    //generated new access/refresh tokens by using the decoded user_id
    const tokens = generateAuthTokens(decoded.user_id);
    //store the new refresh token in redis by using the user_id as a key
    await redis_client.set(decoded.user_id, tokens.refreshToken);
    //set new signed cooked that contains  new a refresh token and a new access token
    setAuthCookies({
      res,
      refresh: tokens.refreshToken,
      access: tokens.accessToken,
    });
    //return success
    return res.status(httpStatus.OK).json({ status: "success" });
  } catch (err) {
    //pass the error to the 500 handler middleware
    next(err);
  }
};
export const verifyTokenHandler = (req: Request, res: Response) => {
  const token = (req.headers[ACCESS_COOKIE_NAME] ??
    req.signedCookies[ACCESS_COOKIE_NAME]) as string;
  if (!token || !validateAccessToken(token))
    return res.status(httpStatus.BAD_REQUEST).json("invalid access token");

  return res.status(httpStatus.OK).json();
};
export const logoutTokenHandler = (req: Request, res: Response) => {
  return res.status(httpStatus.OK).json("logout");
};
