import { AnyZodObject, ZodEffects } from "zod";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const zodValidatorMiddleware =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const valid = await schema.safeParseAsync(req.body);
    if (!valid.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "please make sure that you didn't miss any required field",
        errors: {
          fields: valid.error.formErrors.fieldErrors,
          form: valid.error.formErrors.formErrors,
        },
      });
    }
    return next();
  };
