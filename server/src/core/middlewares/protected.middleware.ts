import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { validateAccessToken } from "../../apps/auth/auth.services";
import { ACCESS_COOKIE_NAME } from "../constants";
import prisma from "../prisma";

const protectedRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access =
    req.signedCookies[ACCESS_COOKIE_NAME] ?? req.headers[ACCESS_COOKIE_NAME];
  const decoded = validateAccessToken(access);
  if (!decoded) return res.sendStatus(httpStatus.UNAUTHORIZED);
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.user_id,
      },
    });
    //@ts-ignore
    req.user = user;
  } catch (err) {
    next(err);
  }

  next();
};
export default protectedRouteMiddleware;
