import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.util";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Cannot find endpoint ${req.method} ${req.originalUrl} on this server.`));
};
