"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastGeneratedTokenFromAUser = exports.deleteTokenById = exports.findTokenByToken = exports.createTokenInteractor = exports.findUserByEmailInterector = exports.updateUserInteractor = exports.createUserInteractor = void 0;
const prisma_1 = __importDefault(require("../../core/prisma"));
const createUserInteractor = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.create({
        data: {
            email: inputs.email,
            username: inputs.username,
            password: inputs.password,
            verified: inputs.verified,
            active: inputs.verified,
        },
    });
});
exports.createUserInteractor = createUserInteractor;
const updateUserInteractor = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: {
            id: inputs.userId,
        },
        data: {
            email: inputs.email,
            username: inputs.username,
            active: inputs.active,
            verified: inputs.verified,
            password: inputs.password,
        },
    });
});
exports.updateUserInteractor = updateUserInteractor;
const findUserByEmailInterector = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
});
exports.findUserByEmailInterector = findUserByEmailInterector;
const createTokenInteractor = (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.token.create({
        data: {
            token: inputs.token,
            userId: inputs.userId,
            expiresAt: inputs.expiresAt,
        },
    });
});
exports.createTokenInteractor = createTokenInteractor;
const findTokenByToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.token.findFirst({
        where: {
            token,
        },
    });
});
exports.findTokenByToken = findTokenByToken;
const deleteTokenById = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.token.delete({
        where: {
            id: tokenId,
        },
    });
});
exports.deleteTokenById = deleteTokenById;
const getLastGeneratedTokenFromAUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [token] = yield prisma_1.default.token.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
    return token;
});
exports.getLastGeneratedTokenFromAUser = getLastGeneratedTokenFromAUser;
