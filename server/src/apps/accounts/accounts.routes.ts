import { Router } from "express";
import protectedRouteMiddleware from "../../core/middlewares/protected.middleware";
import {
  accountsMeHandler,
  accountsRegisterHandler,
} from "./accounts.handlers";

export const accountsRouter = Router();
accountsRouter.get("/register", accountsRegisterHandler);
accountsRouter.get("/me", protectedRouteMiddleware, accountsMeHandler);
