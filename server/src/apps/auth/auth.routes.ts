import { Router } from "express";
import {
  logoutTokenHandler,
  obtainTokenHandler,
  refreshTokenHandler,
  verifyTokenHandler,
} from "./auth.handlers";

export const authRouter = Router();

authRouter.get("/token/obtain", obtainTokenHandler);
authRouter.get("/token/refresh", refreshTokenHandler);
authRouter.get("/token/verify", verifyTokenHandler);
authRouter.get("/token/logout", logoutTokenHandler);
