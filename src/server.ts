import app from "./app";
import { connectDB } from "./config/db.config";
import { env } from "./config/env.config";
import { logger } from "./utils/logger.util";

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`[Server] Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    logger.info(`[Server] Health check: http://localhost:${env.PORT}/`);
    logger.info(`[Server] Base API: http://localhost:${env.PORT}/api`);
    logger.info(`[Server] Swagger Docs: http://localhost:${env.PORT}/api-docs`);
  });

  // Handle Unhandled Rejections
  process.on("unhandledRejection", (err: Error) => {
    logger.error("[Server] UNHANDLED REJECTION! Shutting down...", err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle Uncaught Exceptions
  process.on("uncaughtException", (err: Error) => {
    logger.error("[Server] UNCAUGHT EXCEPTION! Shutting down...", err);
    process.exit(1);
  });

  // Handle SIGTERM
  process.on("SIGTERM", () => {
    logger.info("[Server] SIGTERM received. Graceful shutdown initiated.");
    server.close(() => {
      logger.info("[Server] Process terminated.");
    });
  });
};

startServer();
