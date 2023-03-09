import { Router } from "express";
import { zodValidatorMiddleware } from "../../core/middlewares/zod.middleware";
import {
  logoutTokenHandler,
  obtainTokenHandler,
  refreshTokenHandler,
  verifyTokenHandler,
} from "./auth.handlers";
import { loginSchema } from "./auth.schemas";

export const authRouter = Router();

authRouter.post(
  "/token/obtain",
  zodValidatorMiddleware(loginSchema),
  obtainTokenHandler
);
authRouter.post("/token/refresh", refreshTokenHandler);
authRouter.post("/token/verify", verifyTokenHandler);
authRouter.post("/token/logout", logoutTokenHandler);
