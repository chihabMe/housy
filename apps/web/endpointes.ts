/* eslint-disable turbo/no-undeclared-env-vars */
export const API = process.env.API ?? "http://localhost:3000/";

export const helloEndpoint = API + "api/v1/hello";

export const loginEndpoint = API + "api/v1/auth/token/obtain";
export const registrationEndpoint = API + "api/v1/accounts";
export const accountsActivateEndpoint = API + "api/v1/accounts/activate";
