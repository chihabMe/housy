import { CookieOptions, Response } from "express";
import {
  accessTokenMaxAge,
  ACCESS_COOKIE_NAME,
  refreshTokenMaxAge,
  REFRESH_COOKIE_NAME,
} from "../../../core/constants";

import env from "../../../core/env";

const basicCookieOptions: CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: env.isProduction(),
  sameSite: env.isProduction() ? "strict" : "lax",
  signed: true,
};
const refreshCookieOptions: CookieOptions = {
  maxAge: refreshTokenMaxAge * 1000,
  ...basicCookieOptions,
};
const accessCookieOptions: CookieOptions = {
  maxAge: accessTokenMaxAge * 1000,
  ...basicCookieOptions,
};
export const setAuthCookies = ({
  res,
  refresh,
  access,
}: {
  refresh: string;

  access: string;
  res: Response;
}) => {
  res.cookie(REFRESH_COOKIE_NAME, refresh, refreshCookieOptions);
  res.cookie(ACCESS_COOKIE_NAME, access, accessCookieOptions);
};
