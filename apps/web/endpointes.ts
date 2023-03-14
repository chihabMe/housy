/* eslint-disable turbo/no-undeclared-env-vars */
export const API = process.env.API ?? "http://localhost:3000/";

export const helloEndpoint = API + "api/v1/hello";
