import express, { Express } from "express";
import { accountsRouter } from "./apps/accounts/accounts.routes";
import { authRouter } from "./apps/auth/auth.routes";
import env from "./core/env";
import _404 from "./core/middlewares/404.middleware";
import _500 from "./core/middlewares/500.middleware";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import redis_client, { redis_client_connect } from "./core/redis_clinet";

const server = async () => {
  const app = express();
  registerMiddlewares(app);
  registerApps(app);
  registerErrorsMiddlewares(app);
  redis_client_connect();
  app.listen(env.PORT, () => {
    console.log(`running the server on port ${env.PORT}`);
  });
};

const registerApps = (app: Express) => {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/accounts", accountsRouter);
};
const registerMiddlewares = (app: Express) => {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.getCookieSecretKey()));
};
const registerErrorsMiddlewares = (app: Express) => {
  app.use(_404);
  app.use(_500);
};

if (require.main == module) server();
