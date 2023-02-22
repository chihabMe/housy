import { Router } from "express";
import protectedRouteMiddleware from "../../core/middlewares/protected.middleware";
import {
  accountsActivateHandler,
  accountsChangeEmailHandler,
  accountsChangePassword,
  accountsDeleteHandler,
  accountsMeHandler,
  accountsRegisterHandler,
  accountsRestorePasswordHandler,
} from "./accounts.handlers";

export const accountsRouter = Router();
accountsRouter.get("/register", accountsRegisterHandler);
accountsRouter.get("/me", protectedRouteMiddleware, accountsMeHandler);
accountsRouter.get("/restore/password", accountsRestorePasswordHandler);

//
accountsRouter.get("/delete", protectedRouteMiddleware, accountsDeleteHandler);
accountsRouter.get(
  "/activate",
  protectedRouteMiddleware,
  accountsActivateHandler
);
accountsRouter.get(
  "/change/email",
  protectedRouteMiddleware,
  accountsChangeEmailHandler
);
accountsRouter.get(
  "/change/password",
  protectedRouteMiddleware,
  accountsChangePassword
);
