import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { loginEndpoint } from "../../../../endpointes";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    const cookies = response.headers.get("Set-Cookie") as string;
    res.setHeader("Set-Cookie", cookies);
    return res.status(response.status).json(data);
  } catch (err) {
    console.log(err);
    return res.json(500);
  }
};

export default login;
