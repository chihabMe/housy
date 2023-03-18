import express, { Express } from "express";
import { accountsRouter } from "../apps/accounts/accounts.routes";
import { authRouter } from "../apps/auth/auth.routes";
import env from "../core/env";
import _404 from "../core/middlewares/404.middleware";
import _500 from "../core/middlewares/500.middleware";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { parse } from "url";
import helmet from "helmet";

export const createServer = (): Express => {
  const app = express();
  registerMiddlewares(app);
  app.get("api/v1/hello", (req, res) => {
    res.json("hello world");
  });
  registerApps(app);
  registerErrorsMiddlewares(app);
  return app;
};

const registerApps = (app: Express) => {
  app.get("/api/v1/hello", (req, res) => res.status(200).json("hello world"));
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/accounts", accountsRouter);
};
const registerMiddlewares = (app: Express) => {
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.getCookieSecretKey()));
};
const registerErrorsMiddlewares = (app: Express) => {
  app.use(_404);
  app.use(_500);
};
