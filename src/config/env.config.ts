import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "8080", 10),
  MONGO_URI: process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_db",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey_ecommerce_2026_jwt_token",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  SMTP_SERVICE: process.env.SMTP_SERVICE || "Gmail",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "465", 10),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM: process.env.SMTP_FROM || "no-reply@ecommerce.com",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
