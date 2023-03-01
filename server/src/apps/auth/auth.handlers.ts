import { NextFunction, Request, Response } from "express";
import httpStatus, { BAD_REQUEST } from "http-status";
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
  //extracts the email and the password from the body
  const { email, password } = req.body;
  try {
    //try to find a use with this email
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    //if there is no use with this email
    // or
    // the entered password is not he same as that user password
    // return an 400 error with invalid credentials
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        type: "invalidCredentials",
        error: "please check your email and password and try again",
      });

    if (!user.verified || !user.active)
      return res.status(BAD_REQUEST).json({
        success: false,
        type: "unverifiedEmail",
        error:
          "you need to verify your email to activate your account please check your email box for the activation email if you didn't receive any emails you can request a new activation email ",
      });
    // if the user credentials are valid
    // generate an access and refresh token
    const tokens = generateAuthTokens(user.id);
    //store the refreh token in redis by using the user id as a key
    redis_client.set(user.id, tokens.refreshToken);
    //set the authentication headers for the response
    setAuthCookies({
      res,
      access: tokens.accessToken,
      refresh: tokens.refreshToken,
    });
    //return success response
    return res.status(httpStatus.OK).json({
      success: true,
    });
  } catch (err) {
    //pass the error to the errors handler middleware
    next(err);
  }
};

//this  handler fucn is responsble for refreshing the user access token and rotating the refresh token
//this handler func extracts  the refresh token from  the refresh header or the refresh cookie
// it will compare the revcieved refresh token with the one stored in redis
// it  will generate a new access token and a new refresh token if they are the same
// it will store the refresh token in redis by using the user id as a key
// it will set new refresh/access cookies
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
    // await redis_client.set(decoded.user_id, tokens.refreshToken);
    redis_client.set(decoded.user_id, tokens.refreshToken);
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
  //get the access token from the header or the cookie
  const token = (req.headers[ACCESS_COOKIE_NAME] ??
    req.signedCookies[ACCESS_COOKIE_NAME]) as string;

  //if there is no token or the token is invalid return 400 error invalid token
  if (!validateAccessToken(token))
    return res.status(httpStatus.BAD_REQUEST).json("invalid access token");
  //else
  //return success status
  return res.status(httpStatus.OK).json();
};
export const logoutTokenHandler = async (req: Request, res: Response) => {
  //get the refresh token from the header or the cookie
  const refresh = (req.headers[REFRESH_COOKIE_NAME] ??
    req.signedCookies[REFRESH_COOKIE_NAME]) as string;
  //if there is no token or the token is invalid return 400 error invalid refresh token
  const decoded = validateRefreshToken(refresh);
  if (!decoded)
    return res.status(httpStatus.BAD_REQUEST).json("invalid refresh token");
  //if the refresh token is valid
  //delete it from redis by using the user_id as a key
  // await redis_client.del(decoded.user_id);
  redis_client.del(decoded.user_id);
  //delete the auth cookies
  res.clearCookie(REFRESH_COOKIE_NAME);
  res.clearCookie(ACCESS_COOKIE_NAME);
  //return a success response
  return res.status(httpStatus.OK).json("logged out");
};
