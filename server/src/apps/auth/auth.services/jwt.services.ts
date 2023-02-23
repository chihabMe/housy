import jwt from "jsonwebtoken";
import { accessTokenMaxAge, refreshTokenMaxAge } from "../../../core/constants";
import env from "../../../core/env";

export const generateTokens = (user_id: string) => {
  const accessToken = jwt.sign({ user_id }, env.getAccessSecret(), {
    expiresIn: accessTokenMaxAge,
  });
  const refreshToken = jwt.sign({ user_id }, env.getRefreshTokenSecret(), {
    expiresIn: refreshTokenMaxAge,
  });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string) => {
  return jwt.verify(token, env.getAccessSecret(), (err, decoded) => {
    if (err) return false;
    return true;
  });
};
export const validateRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.getRefreshTokenSecret());
    console.log(decoded);
    return true;
  } catch (err) {
    return false;
  }
};
