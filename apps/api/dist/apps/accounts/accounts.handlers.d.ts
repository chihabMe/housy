import { Request, Response, NextFunction } from "express";
import { TypeOf } from "zod";
import { passwordChangeSchema, registrationSchema } from "./accounts.schemas";
export declare const accountsRegisterHandler: (req: Request<{}, {}, TypeOf<typeof registrationSchema>>, res: Response, next: NextFunction) => Promise<void>;
export declare const accountsMeHandler: (req: Request, res: Response) => void;
export declare const accountsDeleteHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const accountsActivateHandler: (req: Request<{
    token: string;
}>, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const accountsChangePassword: (req: Request<{}, {}, TypeOf<typeof passwordChangeSchema>>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const accountsChangeEmailHandler: (req: Request, res: Response) => void;
export declare const accountsRestorePasswordHandler: (req: Request, res: Response) => void;
export declare const generateAccountActivationEmailHandler: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const accountsUpdateProfileHandler: (req: Request<{}, {}, {
    username?: string;
}>, res: Response) => Promise<void>;
//# sourceMappingURL=accounts.handlers.d.ts.map