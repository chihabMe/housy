import supertest from "supertest";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_clinet";
import { createServer } from "../../../server";

const app = createServer();

describe("user registration", () => {
  beforeAll(async () => {
    await redis_client_connect();
  });
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.property.deleteMany();
    await prisma.propertyCategory.deleteMany();
    await prisma.$disconnect();
  });
  describe("test user registration", () => {
    it("there is not user in the database", async () => {
      const numberOfUsers = await prisma.user.count();
      expect(numberOfUsers).toBe(0);
    });
    it("if the user didn't provide a username,email,password or rePassword he will get 400 error", async () => {
      const response = await supertest(app).post(`/api/v1/accounts`);
      expect(response.status).toBe(400);
      expect(response.body.fieldErrors.username[0]).toEqual("Required");
      expect(response.body.fieldErrors.email[0]).toEqual("Required");
      expect(response.body.fieldErrors.password[0]).toEqual("Required");
      expect(response.body.fieldErrors.rePassword[0]).toEqual("Required");
    });
    it("if user didn't miss any  field a new user will be created and he will receive a response that contains his information ", async () => {
      const userCredentials = {
        username: "chihab",
        email: "chihab@email.com",
        password: "password",
        rePassword: "password",
      };
      const response = await supertest(app)
        .post(`/api/v1/accounts`)
        .send(userCredentials);
      expect(response.body.username).toEqual(userCredentials.username);
      expect(response.body.email).toEqual(userCredentials.email);
    });
    it("there is one user in the database ", async () => {
      const numberOfUsers = await prisma.user.count();
      expect(numberOfUsers).toBe(1);
    });
  });
});
