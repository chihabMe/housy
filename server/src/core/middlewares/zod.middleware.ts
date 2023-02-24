import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const zodValidatorMiddleware =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const valid = await schema.safeParseAsync(req.body);
    if (!valid.success) {
      return res.status(httpStatus.BAD_REQUEST).json(valid.error.formErrors);
    }
    return next();
  };
