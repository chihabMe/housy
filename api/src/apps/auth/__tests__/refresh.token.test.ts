import supertest from "supertest";
import { REFRESH_COOKIE_NAME } from "../../../core/constants";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_client";
import { hasher } from "../../../libs/hasher";
import { extractAuthCookiesFromHeaders } from "../../../libs/helpers/headers.helpers";
import sleep from "../../../libs/helpers/sleep";
import jsonRepose from "../../../libs/jsonResponse";
import { createServer } from "../../../server";
import { createUserInteractor } from "../../accounts/accounts.interactors";

const app = createServer();
const request = supertest(app);
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
  describe("trying to refresh without providing a refresh token", () => {
    it("should return 400 error with invalid refresh token error ", async () => {
      const response = await supertest(app).post("/api/v1/auth/token/refresh");
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
    });
  });
  //this variable i will use to to store a dead refresh token
  //to test if my api is blacklisting refresh ing them or not
  let storedRefreshToken = "";
  describe("trying to refresh with providing a refresh token", () => {
    //if a user provided a refresh token
    it("it should return 200 with refreshed message and it will update the refresh/authorization cookies with new generated ones", async () => {
      const obtainTokensResponse = await request
        .post("/api/v1/auth/token/obtain")
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        });
      expect(obtainTokensResponse.status).toEqual(200);
      let { refresh, access } = extractAuthCookiesFromHeaders(
        obtainTokensResponse.headers
      );
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
      const refreshResponse = await request
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
      let tokens = extractAuthCookiesFromHeaders(refreshResponse.headers);
      expect(tokens).toEqual({
        access: expect.any(String),
        refresh: expect.any(String),
      });
      //store the  dead refresh token that
      storedRefreshToken = obtainTokensResponse.body.tokens.refresh;
    });
  });
  describe("trying to refresh with a  refresh has been used before", () => {
    it("should return 400 error with blacklisted token error", async () => {
      const refreshResponse = await request
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
    });
  });
});
