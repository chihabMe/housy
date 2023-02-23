import { config } from "dotenv";
config();
const PORT = process.env.PORT ?? 3001;
export const getCookieSecretKey = () => {
  const secret = process.env.COOKIE_SECRET;
  if (!secret)
    throw new Error("please provide a COOKIE_SECRET as env variable");
  return secret;
};
const isProduction = () => {
  return process.env.MODE == "PRODUCTION";
};
const getRefreshTokenSecret = () => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret)
    throw new Error("please provide a REFRESH_SECRET as env variable");
  return secret;
};
const getAccessSecret = () => {
  const secret = process.env.REFRESH_SECRET;
  if (!secret)
    throw new Error("please provide a ACCESS_SECRET as env variable");
  return secret;
};

export default {
  PORT,
  isProduction,
  getRefreshTokenSecret,
  getAccessSecret,
  getCookieSecretKey,
};
