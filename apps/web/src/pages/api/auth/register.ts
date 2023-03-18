import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { loginEndpoint, registrationEndpoint } from "../../../../endpointes";

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(registrationEndpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.log(err);
    return res.json(500);
  }
};

export default register;
