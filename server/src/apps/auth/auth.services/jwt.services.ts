import jwt, { JwtPayload } from "jsonwebtoken";
import { accessTokenMaxAge, refreshTokenMaxAge } from "../../../core/constants";
import env from "../../../core/env";

export const generateAuthTokens = (user_id: string) => {
  console.log(accessTokenMaxAge);
  const accessToken = jwt.sign({ user_id }, env.getAccessSecret(), {
    expiresIn: accessTokenMaxAge,
  });
  const refreshToken = jwt.sign({ user_id }, env.getRefreshTokenSecret(), {
    expiresIn: refreshTokenMaxAge,
  });
  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(
      token,
      env.getAccessSecret()
    ) as tokenPayloadType;
    return decoded;
  } catch {
    return null;
  }
};
export const validateRefreshToken = (token: string) => {
  if (!token) return null;
  try {
    const decoded = jwt.verify(
      token,
      env.getRefreshTokenSecret()
    ) as tokenPayloadType;
    return decoded;
  } catch (err) {
    return null;
  }
};
type tokenPayloadType = JwtPayload & { user_id: string };
