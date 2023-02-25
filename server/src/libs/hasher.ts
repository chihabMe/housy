import bcrypt from "bcrypt";

export const hasher = (password: string) => {
  return bcrypt.hashSync(password, 10);
};
