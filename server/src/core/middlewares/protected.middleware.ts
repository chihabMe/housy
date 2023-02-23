import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { validateAccessToken } from "../../apps/auth/auth.services";
import { ACCESS_COOKIE_NAME } from "../constants";

const protectedRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access = req.signedCookies[ACCESS_COOKIE_NAME];
  if (!validateAccessToken(access))
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  next();
};
export default protectedRouteMiddleware;
