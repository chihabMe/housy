import express, { Express } from "express";
import { accountsRouter } from "./apps/accounts/accounts.routes";
import { authRouter } from "./apps/auth/auth.routes";
import env from "./core/env";
import _404 from "./core/middlewares/404.middleware";
import _500 from "./core/middlewares/500.middleware";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { redis_client_connect } from "./core/redis_clinet";
// import { promisify } from "util";
// const readFilesAsync = promisify(readFile);

const server = async () => {
  // const key = fs.readFileSync(__dirname + "/ssl/housy.pem");
  // const cert = fs.readFileSync(__dirname + "/ssl/housy.crt");

  const app = express();
  registerMiddlewares(app);
  registerApps(app);
  registerErrorsMiddlewares(app);
  try {
    await redis_client_connect();
    app.listen(env.PORT, () => {
      console.log(`running the server on port ${env.PORT}`);
    });
    // const opts = { key: key.toString(), cert: cert.toString() };
    // https.createServer(opts, app).listen(env.PORT, () => {
    //   console.log("the server is running on port ", env.PORT);
    // });
  } catch (err) {
    console.log(err);
    process.exit();
  }
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
