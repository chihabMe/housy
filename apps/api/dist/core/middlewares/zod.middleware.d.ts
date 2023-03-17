import { AnyZodObject, ZodEffects } from "zod";
import { Request, Response, NextFunction } from "express";
export declare const zodValidatorMiddleware: (schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=zod.middleware.d.ts.map