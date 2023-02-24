import { Request, Response, NextFunction } from "express";

const protectedRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log("run protected")
  next();
};
export default protectedRouteMiddleware;
