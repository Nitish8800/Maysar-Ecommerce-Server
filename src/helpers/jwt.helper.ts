import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.config";
import { IJWTPayload } from "../types/common.types";

export const generateToken = (payload: IJWTPayload): string => {
  const secret: Secret = env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): IJWTPayload => {
  const secret: Secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as IJWTPayload;
};
