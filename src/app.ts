import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import { corsOptions } from "./config/cors.config";
import { helmetOptions } from "./config/helmet.config";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware";
import { morganMiddleware } from "./utils/logger.util";
import { notFoundHandler } from "./middleware/notFound.middleware";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config";

const app: Application = express();

// Security Middlewares
app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(globalRateLimiter);

// Logging Middleware
app.use(morganMiddleware);

// Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static Uploads Serving
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// Root Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Ecommerce API Server is healthy and running.",
    swaggerDocs: "/api-docs",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", routes);

// 404 Not Found Middleware
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
