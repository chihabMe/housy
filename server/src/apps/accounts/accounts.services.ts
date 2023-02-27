import crypto from "crypto";
import bcrypt from "bcrypt";
import {
  REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME,
  TOKEN_EXPIRES_TIME,
} from "../../core/constants";
import env from "../../core/env";
import redis_client from "../../core/redis_clinet";
import {
  generateCanRequestAnotherTokenRedisKey,
  prefixActivationToken,
} from "../../libs/helpers/activation";
export const generateActivationTokenAndStoreItInRedis = async ({
  userId,
}: {
  userId: string;
}) => {
  //generate 16 random  characters (token)
  const activationToken = crypto.randomBytes(16).toString("hex");
  //2 store the userId as value in redis with the token as key
  await redis_client.set(prefixActivationToken(activationToken), userId, {
    EX: TOKEN_EXPIRES_TIME,
  });
  //
  await redis_client.set(generateCanRequestAnotherTokenRedisKey(userId), 1, {
    EX: REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME,
  });
  //3 return the generated token
  return activationToken;
};
export const generateActivationURI = ({
  token,
  host,
}: {
  host: string;
  token: string;
}) => {
  return `${
    env.isProduction() ? "https" : "http"
  }://${host}/api/v1/accounts/activate/${token}`;
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

export const compareUserPassword = ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}) => {
  return bcrypt.compareSync(password, hash);
};

//this function will
//get the userId from redis by using the activation as key
export const getUserIdFromRedisUsingTheActionToken = async (token: string) => {
  return await redis_client.get(prefixActivationToken(token));
};
//this function will
//delete the activationToken from redis
export const invalidateTheActivationToken = async (token: string) => {
  return redis_client.del(prefixActivationToken(token));
};
