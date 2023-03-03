import prisma from "../../core/prisma";
import { hasher } from "../../libs/hasher";

interface createUserInteractorInputs {
  email: string;
  username: string;
  password: string;
}
export const createUserInteractor = async (
  inputs: createUserInteractorInputs
) => {
  return await prisma.user.create({
    data: {
      email: inputs.email,
      username: inputs.username,
      password: hasher(inputs.password),
    },
  });
};

interface updateUserInteractor {
  userId: string;
  email?: string;
  username?: string;
  password?: string;
  active?: boolean;
  verified: boolean;
}
export const updateUserInteractor = async (inputs: updateUserInteractor) => {
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
