import { Request, Response, NextFunction } from "express";
declare const protectedRouteMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default protectedRouteMiddleware;
//# sourceMappingURL=protected.middleware.d.ts.map