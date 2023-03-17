export declare const storeThatThisUserAskedForAToken: (userId: string) => Promise<void>;
export declare const generateActivationURI: ({ token, host, }: {
    host: string;
    token: string;
}) => string;
export declare const generateActivationEmail: ({ activationURI, }: {
    activationURI: string;
}) => string;
export declare const compareUserPassword: ({ password, hash, }: {
    password: string;
    hash: string;
}) => boolean;
export declare const getUserIdFromRedisUsingTheActionToken: (token: string) => Promise<string | null>;
export declare const invalidateTheActivationToken: (token: string) => Promise<number>;
//# sourceMappingURL=accounts.services.d.ts.map