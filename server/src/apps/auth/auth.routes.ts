import { Router } from "express";
import { zodValidatorMiddleware } from "../../core/middlewares/zod.middleware";
import { loginSchema } from "../../lib/schemas/auth/login.schemas";
import {
  logoutTokenHandler,
  obtainTokenHandler,
  refreshTokenHandler,
  verifyTokenHandler,
} from "./auth.handlers";

export const authRouter = Router();

authRouter.get(
  "/token/obtain",
  zodValidatorMiddleware(loginSchema),
  obtainTokenHandler
);
authRouter.get("/token/refresh", refreshTokenHandler);
authRouter.get("/token/verify", verifyTokenHandler);
authRouter.get("/token/logout", logoutTokenHandler);
