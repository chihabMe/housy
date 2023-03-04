import { User } from "@prisma/client";
import prisma from "../../core/prisma";
import { hasher } from "../../libs/hasher";

interface CreateUserInteractorInputs {
  email: string;
  username: string;
  password: string;
  active?: boolean;
  verified?: boolean;
}
export const createUserInteractor = async (
  inputs: CreateUserInteractorInputs
) => {
  return await prisma.user.create({
    data: {
      email: inputs.email,
      username: inputs.username,
      password: inputs.password,
      verified: inputs.verified,
      active: inputs.verified,
    },
  });
};

interface UpdateUserInteractor {
  userId: string;
  email?: string;
  username?: string;
  password?: string;
  active?: boolean;
  verified?: boolean;
}
export const updateUserInteractor = async (inputs: UpdateUserInteractor) => {
  return await prisma.user.update({
    where: {
      id: inputs.userId,
    },
    data: {
      email: inputs.email,
      username: inputs.username,
      active: inputs.active,
      verified: inputs.verified,
      password: inputs.password,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

interface CreateTokenInputs {
  userId: string;
  token: string;
  expiresAt: number;
}
export const createTokenInteractor = async (inputs: CreateTokenInputs) => {
  return await prisma.token.create({
    data: {
      token: inputs.token,
      userId: inputs.userId,
      expiresAt: inputs.expiresAt,
    },
  });
};

export const findTokenByToken = async (token: string) => {
  return await prisma.token.findFirst({
    where: {
      token,
    },
  });
};
export const deleteTokenById = async (tokenId: string) => {
  return await prisma.token.delete({
    where: {
      id: tokenId,
    },
  });
};

export const getLastGeneratedTokenFromAUser = async (userId: string) => {
  const [token] = await prisma.token.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  return token;
};
