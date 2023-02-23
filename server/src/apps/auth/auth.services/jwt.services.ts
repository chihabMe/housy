import jwt from "jsonwebtoken";
import { accessTokenMaxAge, refreshTokenMaxAge } from "../../../core/constants";
import env from "../../../core/env";

export const generateAuthTokens = (user_id: string) => {
  const accessToken = jwt.sign({ user_id }, env.getAccessSecret(), {
    expiresIn: accessTokenMaxAge,
  });
  const refreshToken = jwt.sign({ user_id }, env.getRefreshTokenSecret(), {
    expiresIn: refreshTokenMaxAge,
  });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string) => {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, env.getAccessSecret());
    return true;
  } catch {
    return false;
  }
};
export const validateRefreshToken = (token: string) => {
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, env.getRefreshTokenSecret());
    return true;
  } catch (err) {
    return false;
  }
};
