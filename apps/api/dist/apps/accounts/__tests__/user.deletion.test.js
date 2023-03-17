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
const http_status_1 = __importDefault(require("http-status"));
const supertest_1 = __importDefault(require("supertest"));
const prisma_1 = __importDefault(require("../../../core/prisma"));
const redis_client_1 = require("../../../core/redis_client");
const hasher_1 = require("../../../libs/hasher");
const server_1 = require("../../../utils/server");
const auth_services_1 = require("../../auth/auth.services");
const accounts_interactors_1 = require("../accounts.interactors");
const accounts_services_1 = require("../accounts.services");
const app = (0, server_1.createServer)();
const userCredentials = {
    email: "test@email.com",
    password: "password",
    username: "test",
    active: true,
    verified: true,
};
let jwt = "";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_client_1.redis_client_connect)();
    const user = yield (0, accounts_interactors_1.createUserInteractor)(Object.assign(Object.assign({}, userCredentials), { password: (0, hasher_1.hasher)(userCredentials.password) }));
    yield (0, accounts_interactors_1.updateUserInteractor)({ userId: user.id, active: true, verified: true });
    jwt = (0, auth_services_1.generateAuthTokens)(user.id).accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.deleteMany();
}));
describe("user deletion", () => {
    it("the user didn't provide authentication cookies/headers", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/api/v1/accounts");
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    }));
    //inactivating the user
    it("should make the user inactive", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, accounts_interactors_1.findUserByEmailInterector)(userCredentials.email);
        const activationURI = accounts_services_1.getUserIdFromRedisUsingTheActionToken;
        //login
        let loginResponse = yield (0, supertest_1.default)(app)
            .post("/api/v1/auth/token/obtain")
            .send({
            email: userCredentials.email,
            password: userCredentials.password,
        });
        expect(loginResponse.status).toEqual(200);
        const deletionResponse = yield yield (0, supertest_1.default)(app)
            .delete("/api/v1/accounts/")
            .set({ authorization: `Bearer ${jwt}` });
        expect(deletionResponse.status).toEqual(200);
    }));
    //the user.active should be false
    it("should be inactive ", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, accounts_interactors_1.findUserByEmailInterector)(userCredentials.email);
        expect(user === null || user === void 0 ? void 0 : user.active).toEqual(false);
        expect(user === null || user === void 0 ? void 0 : user.verified).toEqual(true);
    }));
});
