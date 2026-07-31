import { Request, Response, NextFunction } from "express";

/**
 * Rate limiters have been completely disabled across all functions and routes.
 * Requests will pass through without any rate-limit throttling or 429 errors.
 */
export const globalRateLimiter = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};

export const authRateLimiter = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};


