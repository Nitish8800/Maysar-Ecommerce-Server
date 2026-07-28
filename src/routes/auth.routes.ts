import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import {
  sendSignupOtpValidator,
  verifySignupOtpValidator,
  sendLoginOtpValidator,
  verifyLoginOtpValidator,
  resendOtpValidator,
} from "../validators/auth.validator";
import { validate } from "../middleware/validate.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();

router.post("/signup/send-otp", authRateLimiter, sendSignupOtpValidator, validate, authController.sendSignupOtp);
router.post("/signup/verify", authRateLimiter, verifySignupOtpValidator, validate, authController.verifySignup);
router.post("/login/send-otp", authRateLimiter, sendLoginOtpValidator, validate, authController.sendLoginOtp);
router.post("/login/verify", authRateLimiter, verifyLoginOtpValidator, validate, authController.verifyLogin);
router.post("/resend-otp", authRateLimiter, resendOtpValidator, validate, authController.resendOtp);

router.get("/me", authenticate, authController.getCurrentUser);

export default router;
