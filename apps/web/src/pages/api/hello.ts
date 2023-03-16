import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "database";

export default async function helloEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (er) {
    console.error(err);
    return res.status(400).json("error");
  }
}
