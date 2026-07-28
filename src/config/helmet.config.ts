import { HelmetOptions } from "helmet";

export const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: false, // Set custom CSP rules when serving frontend if needed
  crossOriginResourcePolicy: { policy: "cross-origin" },
};
