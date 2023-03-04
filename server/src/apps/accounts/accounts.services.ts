import crypto from "crypto";
import bcrypt from "bcrypt";
import {
  REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME,
  TOKEN_EXPIRES_TIME,
} from "../../core/constants";
import env from "../../core/env";
import redis_client from "../../core/redis_client";
import {
  generateCanRequestAnotherTokenRedisKey,
  prefixActivationToken,
} from "../../libs/helpers/activation";

export const storeThatThisUserAskedForAToken = async (userId: string) => {
  await redis_client.set(generateCanRequestAnotherTokenRedisKey(userId), 1, {
    EX: REQUEST_ANOTHER_ACTIVATION_TOKEN_TIME,
  });
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
