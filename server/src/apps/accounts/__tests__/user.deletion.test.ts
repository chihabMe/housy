import httpStatus from "http-status";
import supertest from "supertest";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_clinet";
import { hasher } from "../../../libs/hasher";
import { createServer } from "../../../server";
import { generateAuthTokens } from "../../auth/auth.services";
import {
  createUserInteractor,
  findUserByEmail,
  updateUserInteractor,
} from "../accounts.interactors";
import { getUserIdFromRedisUsingTheActionToken } from "../accounts.services";
const app = createServer();
const userCredentials = {
  email: "test@email.com",
  password: "password",
  username: "test",
  active: true,
  verified: true,
};
let jwt = "";
beforeAll(async () => {
  await redis_client_connect();
  const user = await createUserInteractor({
    ...userCredentials,
    password: hasher(userCredentials.password),
  });
  await updateUserInteractor({ userId: user.id, active: true, verified: true });
  jwt = generateAuthTokens(user.id).accessToken;
});
afterAll(async () => {
  await prisma.user.deleteMany();
});

describe("user deletion", () => {
  it("the user didn't provide authentication cookies/headers", async () => {
    const response = await supertest(app).delete("/api/v1/accounts");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  //inactivating the user
  it("should make the user inactive", async () => {
    const user = await findUserByEmail(userCredentials.email);
    const activationURI = getUserIdFromRedisUsingTheActionToken;
    //login
    let loginResponse = await supertest(app)
      .post("/api/v1/auth/token/obtain")
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      });

    expect(loginResponse.status).toEqual(200);
    const deletionResponse = await await supertest(app)
      .delete("/api/v1/accounts/")
      .set({ authorization: `Bearer ${jwt}` });
    console.log(deletionResponse.body);
    expect(deletionResponse.status).toEqual(200);
  });
});
