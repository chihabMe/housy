import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

const _404 = (req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(httpStatus.NOT_FOUND);
};
export default _404;
