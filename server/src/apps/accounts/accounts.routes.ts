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
  generateAccountActivationEmailHandler,
} from "./accounts.handlers";

export const accountsRouter = Router();
accountsRouter.post(
  "/register",
  zodValidatorMiddleware(registrationSchema),
  accountsRegisterHandler
);
accountsRouter.get("/me", protectedRouteMiddleware, accountsMeHandler);
accountsRouter.post("/restore/password", accountsRestorePasswordHandler);

//
accountsRouter.post("/delete", protectedRouteMiddleware, accountsDeleteHandler);
accountsRouter.post("/activate/:token", accountsActivateHandler);
accountsRouter.post(
  "/generate-token/",
  protectedRouteMiddleware,
  generateAccountActivationEmailHandler
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
