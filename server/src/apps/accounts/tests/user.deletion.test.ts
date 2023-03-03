import httpStatus from "http-status";
import supertest from "supertest";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_clinet";
import { createServer } from "../../../server";
const app = createServer();
beforeAll(async () => {
  await redis_client_connect();
  await prisma.user.create({
    data: {
      email: "test@email.com",
      password: "password",
      username: "test",
      active: true,
      verified: true,
    },
  });
});
afterAll(async () => {
  await prisma.user.deleteMany();
});

describe("user deletion", () => {
  it("the user didn't provide authentication cookies/headers", async () => {
    const response = await supertest(app).delete("/api/v1/accounts");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});
