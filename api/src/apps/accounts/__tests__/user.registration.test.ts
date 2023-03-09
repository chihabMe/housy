import supertest from "supertest";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_client";
import { createServer } from "../../../server";
import { findUserByEmailInterector } from "../accounts.interactors";

const app = createServer();
const userCredentials = {
  username: "chihab",
  email: "chihab@email.com",
  password: "password",
  rePassword: "password",
};

describe("user registration", () => {
  beforeAll(async () => {
    await redis_client_connect();
  });
  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteProfiles = prisma.profile.deleteMany();
    const deleteTokens = prisma.token.deleteMany();
    await prisma.$transaction([deleteUsers, deleteProfiles, deleteTokens]);
    await prisma.$disconnect();
  });
  //test the registration endpoint
  describe("test user registration", () => {
    it("there is not user in the database", async () => {
      const numberOfUsers = await prisma.user.count();
      expect(numberOfUsers).toBe(0);
    });
    it("it should return 400 with required fields error ", async () => {
      const response = await supertest(app).post(`/api/v1/accounts`);
      expect(response.status).toBe(400);
      expect(response.body.success).toEqual(false);
      expect(response.body.errors.fields.username[0]).toEqual("Required");
      expect(response.body.errors.fields.email[0]).toEqual("Required");
      expect(response.body.errors.fields.password[0]).toEqual("Required");
      expect(response.body.errors.fields.rePassword[0]).toEqual("Required");
    });
    it("it should return 200 success status with the user email,id,username ", async () => {
      const response = await supertest(app)
        .post(`/api/v1/accounts`)
        .send(userCredentials);
      expect(response.body).toEqual({
        success: true,
        message: "please check your email for the activation link",
      });
    });
    //test number of users in the database
    it("it should be user ", async () => {
      const numberOfUsers = await prisma.user.count();
      expect(numberOfUsers).toBe(1);
    });
    it("it should be unverified and inactive ", async () => {
      const user = await findUserByEmailInterector(userCredentials.email);
      expect(!user).toBeFalsy();
      expect(user!.active).toBe(false);
      expect(user!.verified).toBe(false);
    });
  });
});
