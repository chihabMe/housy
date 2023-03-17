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
const server_1 = require("../../../utils/server");
const accounts_interactors_1 = require("../accounts.interactors");
const app = (0, server_1.createServer)();
const userCredentials = {
    username: "chihab",
    email: "chihab@email.com",
    password: "password",
    rePassword: "password",
};
describe("user registration", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, redis_client_1.redis_client_connect)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const deleteUsers = prisma_1.default.user.deleteMany();
        const deleteProfiles = prisma_1.default.profile.deleteMany();
        const deleteTokens = prisma_1.default.token.deleteMany();
        yield prisma_1.default.$transaction([deleteUsers, deleteProfiles, deleteTokens]);
        yield prisma_1.default.$disconnect();
    }));
    //test the registration endpoint
    describe("test user registration", () => {
        it("there is not user in the database", () => __awaiter(void 0, void 0, void 0, function* () {
            const numberOfUsers = yield prisma_1.default.user.count();
            expect(numberOfUsers).toBe(0);
        }));
        it("it should return 400 with required fields error ", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post(`/api/v1/accounts`);
            expect(response.status).toBe(400);
            expect(response.body.success).toEqual(false);
            expect(response.body.errors.fields.username[0]).toEqual("Required");
            expect(response.body.errors.fields.email[0]).toEqual("Required");
            expect(response.body.errors.fields.password[0]).toEqual("Required");
            expect(response.body.errors.fields.rePassword[0]).toEqual("Required");
        }));
        it("it should return 200 success status with the user email,id,username ", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post(`/api/v1/accounts`)
                .send(userCredentials);
            expect(response.body).toEqual({
                success: true,
                message: "please check your email for the activation link",
            });
        }));
        //test number of users in the database
        it("it should be user ", () => __awaiter(void 0, void 0, void 0, function* () {
            const numberOfUsers = yield prisma_1.default.user.count();
            expect(numberOfUsers).toBe(1);
        }));
        it("it should be unverified and inactive ", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, accounts_interactors_1.findUserByEmailInterector)(userCredentials.email);
            expect(!user).toBeFalsy();
            expect(user.active).toBe(false);
            expect(user.verified).toBe(false);
        }));
    });
});
