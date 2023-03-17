import { NextApiRequest, NextApiResponse } from "next";

export default async function helloEndpoint(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    return res.status(200).json("hello");
  } catch (er) {
    console.error(er);
    return res.status(400).json("error");
  }
}
