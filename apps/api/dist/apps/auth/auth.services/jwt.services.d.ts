import { JwtPayload } from "jsonwebtoken";
export declare const generateAuthTokens: (user_id: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const validateAccessToken: (token: string) => tokenPayloadType | null;
export declare const validateRefreshToken: (token: string) => tokenPayloadType | null;
type tokenPayloadType = JwtPayload & {
    user_id: string;
};
export {};
//# sourceMappingURL=jwt.services.d.ts.map