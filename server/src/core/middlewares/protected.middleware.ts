import { User } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { validateAccessToken } from "../../apps/auth/auth.services";
import jsonRepose from "../../libs/jsonResponse";
import { ACCESS_COOKIE_NAME } from "../constants";
import prisma from "../prisma";

const protectedRouteMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let access: string =
    req.signedCookies[ACCESS_COOKIE_NAME] ?? req.headers[ACCESS_COOKIE_NAME];
  const decoded = validateAccessToken(access);
  if (!decoded)
    return res.status(httpStatus.UNAUTHORIZED).json(
      jsonRepose.error({
        message: `an ${ACCESS_COOKIE_NAME} token cookie or header is required `,
        errors: {
          refresh: "Required",
        },
      })
    );

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.user_id,
      },
    });
    if (!user) return res.sendStatus(httpStatus.UNAUTHORIZED);
    //@ts-ignore
    req.user = user;
  } catch (err) {
    next(err);
  }

  next();
};
export default protectedRouteMiddleware;
