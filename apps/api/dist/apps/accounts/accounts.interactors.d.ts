import { User } from "@prisma/client";
interface CreateUserInteractorInputs {
    email: string;
    username: string;
    password: string;
    active?: boolean;
    verified?: boolean;
}
export declare const createUserInteractor: (inputs: CreateUserInteractorInputs) => Promise<User>;
interface UpdateUserInteractor {
    userId: string;
    email?: string;
    username?: string;
    password?: string;
    active?: boolean;
    verified?: boolean;
}
export declare const updateUserInteractor: (inputs: UpdateUserInteractor) => Promise<User>;
export declare const findUserByEmailInterector: (email: string) => Promise<User | null>;
interface CreateTokenInputs {
    userId: string;
    token: string;
    expiresAt: number;
}
export declare const createTokenInteractor: (inputs: CreateTokenInputs) => Promise<import(".prisma/client").Token>;
export declare const findTokenByToken: (token: string) => Promise<import(".prisma/client").Token | null>;
export declare const deleteTokenById: (tokenId: string) => Promise<import(".prisma/client").Token>;
export declare const getLastGeneratedTokenFromAUser: (userId: string) => Promise<import(".prisma/client").Token>;
export {};
//# sourceMappingURL=accounts.interactors.d.ts.map