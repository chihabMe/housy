/* eslint-disable turbo/no-undeclared-env-vars */
import { config } from "dotenv";
config();
const PORT = process.env.PORT ?? 3001;
const NODE_ENV = process.env.NODE_ENV;
export const getCookieSecretKey = () => {
  const secret = process.env.COOKIE_SECRET;
  if (!secret)
    throw new Error("please provide a COOKIE_SECRET as env variable");
  return secret;
};
const isProduction = () => {
  return process.env.NODE_ENV == "production";
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

export const getRedisURL = () => {
  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;
  const password = process.env.REDIS_PASSWORD;
  const username = process.env.REDIS_USERNAME;
  if (!host || !port || !password || !username)
    throw new Error("please check your redis env variables");

  if (isProduction()) return `rediss://${username}:${password}@${host}:${port}`;
  return `redis://${username}:${password}@${host}:${port}`;
};
const getEmailConfig = () => {
  const host = process.env.EMAIL_HOST;
  const username = process.env.EMAIL_USERNAME;
  const port = process.env.EMAIL_PORT;
  const password = process.env.EMAIL_SECRET;
  if (!host || !password || !port || !username)
    throw new Error("please check your email env variables");
  return {
    host,
    password,
    username,
    port: Number.parseInt(port),
  };
};

export default exports = {
  PORT,
  isProduction,
  getRefreshTokenSecret,
  getAccessSecret,
  getCookieSecretKey,
  getRedisURL,
  getEmailConfig,
  NODE_ENV,
};
