import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const accountsRegisterHandler = (req: Request, res: Response) => {
  res.status(httpStatus.CREATED).json("created");
};
export const accountsMeHandler = (req: Request, res: Response) => {
  res.status(httpStatus.OK).json("me");
};
