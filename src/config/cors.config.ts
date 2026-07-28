import { CorsOptions } from "cors";
import { env } from "./env.config";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (env.CORS_ORIGIN === "*" || !origin) {
      callback(null, true);
    } else {
      const allowedOrigins = env.CORS_ORIGIN.split(",").map((o) => o.trim());
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Policy: Access denied for this origin."));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
