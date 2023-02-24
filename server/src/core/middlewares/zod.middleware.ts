import { AnyZodObject, ZodEffects } from "zod";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const zodValidatorMiddleware =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const valid = await schema.safeParseAsync(req.body);
    if (!valid.success) {
      return res.status(httpStatus.BAD_REQUEST).json(valid.error.formErrors);
    }
    return next();
  };
