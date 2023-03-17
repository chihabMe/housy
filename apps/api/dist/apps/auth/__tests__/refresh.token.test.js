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
const supertest_1 = __importDefault(require("supertest"));
const prisma_1 = __importDefault(require("../../../core/prisma"));
const redis_client_1 = require("../../../core/redis_client");
const hasher_1 = require("../../../libs/hasher");
const headers_helpers_1 = require("../../../libs/helpers/headers.helpers");
const server_1 = require("../../../utils/server");
const accounts_interactors_1 = require("../../accounts/accounts.interactors");
const app = (0, server_1.createServer)();
const request = (0, supertest_1.default)(app);
const userCredentials = {
    username: "chihab",
    email: "chihab@email.com",
    verified: true,
    active: true,
    password: "password",
};
describe("test refreshing the token", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, redis_client_1.redis_client_connect)();
        yield (0, accounts_interactors_1.createUserInteractor)(Object.assign(Object.assign({}, userCredentials), { password: (0, hasher_1.hasher)(userCredentials.password) }));
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const deleteUsers = prisma_1.default.user.deleteMany();
        const deleteProfiles = prisma_1.default.profile.deleteMany();
        const deleteTokens = prisma_1.default.token.deleteMany();
        yield prisma_1.default.$transaction([deleteUsers, deleteProfiles, deleteTokens]);
        yield prisma_1.default.$disconnect();
    }));
    //if the user didn't provide a refresh token
    describe("trying to refresh without providing a refresh token", () => {
        it("should return 400 error with invalid refresh token error ", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post("/api/v1/auth/token/refresh");
            expect(response.status).toEqual(400);
            expect(response.body).toEqual({
                success: false,
                message: "invalid refresh token",
                errors: {
                    fields: {
                        refresh: ["Invalid"],
                    },
                },
            });
        }));
    });
    //this variable i will use to to store a dead refresh token
    //to test if my api is blacklisting refresh ing them or not
    let storedRefreshToken = "";
    describe("trying to refresh with providing a refresh token", () => {
        //if a user provided a refresh token
        it("it should return 200 with refreshed message and it will update the refresh/authorization cookies with new generated ones", () => __awaiter(void 0, void 0, void 0, function* () {
            const obtainTokensResponse = yield request
                .post("/api/v1/auth/token/obtain")
                .send({
                email: userCredentials.email,
                password: userCredentials.password,
            });
            expect(obtainTokensResponse.status).toEqual(200);
            let { refresh, access } = (0, headers_helpers_1.extractAuthCookiesFromHeaders)(obtainTokensResponse.headers);
            expect(refresh).toEqual(expect.any(String));
            expect(access).toEqual(expect.any(String));
            expect(obtainTokensResponse.body).toEqual({
                success: true,
                tokens: {
                    refresh: expect.any(String),
                    access: expect.any(String),
                },
                message: "you are logged in",
            });
            const headers = { refresh: obtainTokensResponse.body.tokens.refresh };
            const refreshResponse = yield request
                .post("/api/v1/auth/token/refresh")
                .set(headers);
            expect(refreshResponse.status).toEqual(200);
            expect(refreshResponse.body).toEqual({
                success: true,
                tokens: {
                    refresh: expect.any(String),
                    access: expect.any(String),
                },
                message: "refreshed",
            });
            let tokens = (0, headers_helpers_1.extractAuthCookiesFromHeaders)(refreshResponse.headers);
            expect(tokens).toEqual({
                access: expect.any(String),
                refresh: expect.any(String),
            });
            //store the  dead refresh token that
            storedRefreshToken = obtainTokensResponse.body.tokens.refresh;
        }));
    });
    describe("trying to refresh with a  refresh has been used before", () => {
        it("should return 400 error with blacklisted token error", () => __awaiter(void 0, void 0, void 0, function* () {
            const refreshResponse = yield request
                .post("/api/v1/auth/token/refresh")
                .set({ refresh: storedRefreshToken });
            expect(refreshResponse.status).toEqual(400);
            expect(refreshResponse.body).toEqual({
                success: false,
                errors: {
                    fields: {
                        refresh: "blacklisted refresh token",
                    },
                },
            });
        }));
    });
});
