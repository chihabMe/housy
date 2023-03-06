import { Router } from "express";
import protectedRouteMiddleware from "../../core/middlewares/protected.middleware";
import { zodValidatorMiddleware } from "../../core/middlewares/zod.middleware";
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
import {
  accountActivationSchema,
  passwordChangeSchema,
  registrationSchema,
} from "./accounts.schemas";

export const accountsRouter = Router();
accountsRouter.post(
  "/",
  zodValidatorMiddleware(registrationSchema),
  accountsRegisterHandler
);
accountsRouter.get("/me", protectedRouteMiddleware, accountsMeHandler);
accountsRouter.post("/restore/password", accountsRestorePasswordHandler);

accountsRouter.delete("/", protectedRouteMiddleware, accountsDeleteHandler);
accountsRouter.get("/activate/:token", accountsActivateHandler);
accountsRouter.post(
  "/generate-token/",
  zodValidatorMiddleware(accountActivationSchema),
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
