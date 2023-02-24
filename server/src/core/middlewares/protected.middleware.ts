import { Request, Response, NextFunction } from "express";

const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
  next();
};
export default protectedRoute;
