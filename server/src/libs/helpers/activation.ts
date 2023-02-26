import { ACTIVATION_TOKEN_PREFIX } from "../../core/constants";

export const prefixActivationToken = (token: string) =>
  ACTIVATION_TOKEN_PREFIX + token;
