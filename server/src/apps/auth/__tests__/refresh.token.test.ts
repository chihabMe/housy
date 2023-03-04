import supertest from "supertest";
import { REFRESH_COOKIE_NAME } from "../../../core/constants";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_clinet";
import { hasher } from "../../../libs/hasher";
import { extractAuthCookiesFromHeaders } from "../../../libs/helpers/headers.helpers";
import { createServer } from "../../../server";
import { createUserInteractor } from "../../accounts/accounts.interactors";

const app = createServer();
const userCredentials = {
  username: "chihab",
  email: "chihab@email.com",
  verified: true,
  active: true,
  password: "password",
};

describe("test refreshing the token", () => {
  beforeAll(async () => {
    await redis_client_connect();
    await createUserInteractor({
      ...userCredentials,
      password: hasher(userCredentials.password),
    });
  });
  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteProfiles = prisma.profile.deleteMany();
    const deleteTokens = prisma.token.deleteMany();
    await prisma.$transaction([deleteUsers, deleteProfiles, deleteTokens]);
    await prisma.$disconnect();
  });

  //if the user didn't provide a refresh token
  it("should return 400 error with invalid refresh token error ", async () => {
    const response = await supertest(app).post("/api/v1/auth/token/refresh");
    expect(response.status).toEqual(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.fields.refresh).toEqual(
      "invalid refresh token"
    );
  });
  //if a user provided a refresh token
  it("it should return 200 with refreshed message and it will update the refresh/authorization cookies with new generated ones", async () => {
    const obtainTokensResponse = await supertest(app)
      .post("/api/v1/auth/token/obtain")
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      });
    expect(obtainTokensResponse.status).toEqual(200);
    const { refresh, access } = extractAuthCookiesFromHeaders(
      obtainTokensResponse.headers
    );
    const refreshResponse = await supertest(app)
      .post("/api/v1/auth/token/refresh")
      .set(obtainTokensResponse.headers);
    expect(refreshResponse.status).toEqual(200);
  });
});
