import express, { Express } from "express";
import { accountsRouter } from "./apps/accounts/accounts.routes";
import { authRouter } from "./apps/auth/auth.routes";
import env from "./core/env";
import _404 from "./core/middlewares/404.middleware";
import _500 from "./core/middlewares/500.middleware";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import next from "next";
import { parse } from "url";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import { ParsedUrlQuery } from "querystring";
// import { promisify } from "util";
// const readFilesAsync = promisify(readFile);

export const createServer = () => {
  // const key = fs.readFileSync(__dirname + "/ssl/housy.pem");
  // const cert = fs.readFileSync(__dirname + "/ssl/housy.crt");
  const nextApp = next({ dev: !env.isProduction() });
  const handle = nextApp.getRequestHandler();
  return nextApp
    .prepare()
    .then(async () => {
      const app = express();
      registerMiddlewares(app);
      registerApps(app);
      app.get("*", async (req, res) => {
        const parsedUrl = parse(req.url, true);
        return await handle(req, res, parsedUrl);
      });
      registerErrorsMiddlewares(app);
      return app;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

const registerApps = (app: Express) => {
  app.get("/api/v1/hello", (req, res) => res.status(200).json("hello world"));
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
