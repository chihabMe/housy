import { Router } from "express";
import { zodValidatorMiddleware } from "../../core/middlewares/zod.middleware";
import { loginSchema } from "../../libs/schemas/auth";
import {
  logoutTokenHandler,
  obtainTokenHandler,
  refreshTokenHandler,
  verifyTokenHandler,
} from "./auth.handlers";

export const authRouter = Router();

authRouter.post(
  "/token/obtain",
  zodValidatorMiddleware(loginSchema),
  obtainTokenHandler
);
authRouter.post("/token/refresh", refreshTokenHandler);
authRouter.post("/token/verify", verifyTokenHandler);
authRouter.post("/token/logout", logoutTokenHandler);
