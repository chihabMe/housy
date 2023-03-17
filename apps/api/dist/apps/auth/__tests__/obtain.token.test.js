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
const constants_1 = require("../../../core/constants");
const prisma_1 = __importDefault(require("../../../core/prisma"));
const redis_client_1 = require("../../../core/redis_client");
const hasher_1 = require("../../../libs/hasher");
const server_1 = require("../../../utils/server");
const accounts_interactors_1 = require("../../accounts/accounts.interactors");
const app = (0, server_1.createServer)();
const userCredentials = {
    username: "chihab",
    email: "chihab@email.com",
    password: "password",
};
describe("token obtain", () => {
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
    //the user missed some fields
    it("should return 400 bad request error with required fields error", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/api/v1/auth/token/obtain");
        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.message).toEqual("please make sure that you didn't miss any required field");
        expect(response.body.errors.fields.email).toEqual(["Required"]);
        expect(response.body.errors.fields.password).toEqual(["Required"]);
    }));
    //the user entree invalid credentials
    it("should return 400 bad request error with invalid credentials error ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/api/v1/auth/token/obtain")
            .send({ email: "invalid@email.com", password: "invalidPassword" });
        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.errors.fields.email).toEqual("invalid email");
        expect(response.body.errors.fields.password).toEqual("invalid password");
        expect(response.body.errors.form).toEqual("please check your email and password and try again");
    }));
    //the user didn't verify his email
    it("should return 400 error with please verify you email error ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/api/v1/auth/token/obtain")
            .send({
            email: userCredentials.email,
            password: userCredentials.password,
        });
        expect(response.status).toEqual(400);
        expect(response.body.success).toEqual(false);
        expect(response.body.errors.fields.email).toEqual("unverified email");
        expect(response.body.errors.form).toEqual("you need to verify your email to activate your account please check your email box for the activation email if you didn't receive any emails you can request a new activation email ");
    }));
    //the user entered  valid credentials
    it("should return 200 success with refresh and authorization headers", () => __awaiter(void 0, void 0, void 0, function* () {
        //activate the user
        const user = yield (0, accounts_interactors_1.findUserByEmailInterector)(userCredentials.email);
        yield (0, accounts_interactors_1.updateUserInteractor)({
            userId: user.id,
            active: true,
            verified: true,
        });
        //try to obtain the tokens
        const response = yield (0, supertest_1.default)(app)
            .post("/api/v1/auth/token/obtain")
            .send({
            email: userCredentials.email,
            password: userCredentials.password,
        });
        const cookies = response.headers["set-cookie"];
        const refresh = cookies[0].split(";")[0].split("=");
        const access = cookies[1].split(";")[0].split("=");
        expect(refresh[0]).toEqual(constants_1.REFRESH_COOKIE_NAME);
        expect(access[0]).toEqual(constants_1.ACCESS_COOKIE_NAME);
        expect(refresh[1]).not.toEqual("");
        expect(access[1]).not.toEqual("");
        expect(response.status).toEqual(200);
        expect(response.body.success).toEqual(true);
        expect(response.body.message).toEqual("you are logged in");
    }));
});
