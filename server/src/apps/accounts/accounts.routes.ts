import { Router } from "express";
import protectedRouteMiddleware from "../../core/middlewares/protected.middleware";
import { zodValidatorMiddleware } from "../../core/middlewares/zod.middleware";
import {
  passwordChangeSchema,
  registrationSchema,
} from "../../libs/schemas/accounts";
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
accountsRouter.post(
  "/register",
  zodValidatorMiddleware(registrationSchema),
  accountsRegisterHandler
);
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
accountsRouter.post(
  "/change/password",
  protectedRouteMiddleware,
  zodValidatorMiddleware(passwordChangeSchema),
  accountsChangePassword
);
