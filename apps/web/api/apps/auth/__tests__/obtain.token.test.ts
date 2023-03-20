import supertest from "supertest";
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from "../../../core/constants";
import prisma from "../../../core/prisma";
import { redis_client_connect } from "../../../core/redis_client";
import { hasher } from "../../../libs/hasher";
import { createServer } from "../../../utils/server";
import {
  createUserInteractor,
  findUserByEmailInterector,
  getLastGeneratedTokenFromAUser,
  updateUserInteractor,
} from "../../accounts/accounts.interactors";

const app = createServer();
const userCredentials = {
  username: "chihab",
  email: "chihab@email.com",
  password: "password",
};

describe("token obtain", () => {
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

  //the user missed some fields
  it("should return 400 bad request error with required fields error", async () => {
    const response = await supertest(app).post("/api/v1/auth/token/obtain");
    expect(response.status).toEqual(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.message).toEqual(
      "please make sure that you didn't miss any required field"
    );
    expect(response.body.errors.fields.email).toEqual(["Required"]);
    expect(response.body.errors.fields.password).toEqual(["Required"]);
  });
  //the user entree invalid credentials
  it("should return 400 bad request error with invalid credentials error ", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/token/obtain")
      .send({ email: "invalid@email.com", password: "invalidPassword" });
    expect(response.status).toEqual(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.errors.fields.email).toEqual("invalid email");
    expect(response.body.errors.fields.password).toEqual("invalid password");
    expect(response.body.errors.form).toEqual(
      "please check your email and password and try again"
    );
  });
  //the user didn't verify his email
  it("should return 400 error with please verify you email error ", async () => {
    const response = await supertest(app)
      .post("/api/v1/auth/token/obtain")
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      });
    expect(response.status).toEqual(400);
    expect(response.body.success).toEqual(false);
    expect(response.body.errors.fields.email).toEqual("unverified email");
    expect(response.body.errors.form).toEqual(
      "you need to verify your email to activate your account please check your email box for the activation email if you didn't receive any emails you can request a new activation email "
    );
  });
  //the user entered  valid credentials
  it("should return 200 success with refresh and authorization headers", async () => {
    //activate the user
    const user = await findUserByEmailInterector(userCredentials.email);
    await updateUserInteractor({
      userId: user!.id,
      active: true,
      verified: true,
    });
    //try to obtain the tokens
    const response = await supertest(app)
      .post("/api/v1/auth/token/obtain")
      .send({
        email: userCredentials.email,
        password: userCredentials.password,
      });
    const cookies = response.headers["set-cookie"];
    const refresh = (cookies[0] as string).split(";")[0].split("=");
    const access = (cookies[1] as string).split(";")[0].split("=");
    expect(refresh[0]).toEqual(REFRESH_COOKIE_NAME);
    expect(access[0]).toEqual(ACCESS_COOKIE_NAME);
    expect(refresh[1]).not.toEqual("");
    expect(access[1]).not.toEqual("");
    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.message).toEqual("you are logged in");
  });
});
