import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/jwt.helper";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/apiError.util";
import { asyncHandler } from "../helpers/asyncHandler.helper";

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.unauthorized("Authentication token required.");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw ApiError.unauthorized("Invalid authorization format. Use Bearer token.");
    }

    try {
      const decoded = verifyToken(token);
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        throw ApiError.unauthorized("User no longer exists.");
      }

      if (user.status === "blocked") {
        throw ApiError.forbidden("Your account is blocked.");
      }

      req.user = user;
      next();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw ApiError.unauthorized("Invalid or expired authentication token.");
    }
  }
);

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required.");
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("Permission denied. Insufficient role access.");
    }

    next();
  };
};