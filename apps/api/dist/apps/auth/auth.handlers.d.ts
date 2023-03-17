import { NextFunction, Request, Response } from "express";
export declare const obtainTokenHandler: (req: Request<{}, {}, {
    email: string;
    password: string;
}>, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const refreshTokenHandler: (req: Request<{}, {}, {
    refresh: string;
}>, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyTokenHandler: (req: Request, res: Response) => Response<any, Record<string, any>>;
export declare const logoutTokenHandler: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.handlers.d.ts.map