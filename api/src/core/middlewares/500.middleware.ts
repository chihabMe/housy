import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const _500 = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  // res.status(httpStatus.INTERNAL_SERVER_ERROR).json(err);
};
export default _500;
