import * as z from "zod";
export declare const accountActivationSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const registrationSchema: z.ZodEffects<z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    rePassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    username: string;
    rePassword: string;
}, {
    password: string;
    email: string;
    username: string;
    rePassword: string;
}>, {
    password: string;
    email: string;
    username: string;
    rePassword: string;
}, {
    password: string;
    email: string;
    username: string;
    rePassword: string;
}>;
export declare const passwordChangeSchema: z.ZodEffects<z.ZodObject<{
    oldPassword: z.ZodString;
    newPassword: z.ZodString;
    newPasswordConfirmation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}, {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}>, {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}, {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
}>;
//# sourceMappingURL=accounts.schemas.d.ts.map