import crypto from "crypto";
import { Request } from "express";
import { TOKEN_EXPIRES_TIME } from "../../core/constants";
import env from "../../core/env";
import redis_client from "../../core/redis_clinet";
export const generateActivationTokenAndStoreItInRedis = async ({
  userId,
}: {
  userId: string;
}) => {
  //generate 16 random  characters (token)
  const activationToken = crypto.randomBytes(16).toString("hex");
  //2 store the userId as value in redis with the token as key
  await redis_client.set(`activation-${activationToken}`, userId, {
    EX: TOKEN_EXPIRES_TIME,
  });
  //3 return the generated token
  return activationToken;
};
export const generateActivationURI = ({
  token,
  req,
}: {
  req: Request;
  token: string;
}) => {
  return `${env.isProduction() ? "https" : "http"}://${
    req.headers.host
  }/api/v1/accounts/activate/${token}`;
};
export const generateActivationEmail = ({
  activationURI,
}: {
  activationURI: string;
}) => {
  return `
    <a href=${activationURI}>
    ${activationURI}
    </a>
    `;
};
