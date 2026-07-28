import { Router } from "express";
import { couponController } from "../controllers/coupon.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { couponValidator } from "../validators/coupon.validator";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

// Validate coupon route for checkout
router.post("/validate", authenticate, couponController.validateCoupon);

// Admin routes
router.get("/", authenticate, authorize("admin"), couponController.getCoupons);
router.post("/", authenticate, authorize("admin"), couponValidator, validate, couponController.createCoupon);
router.put("/:id", authenticate, authorize("admin"), mongoIdParamValidator("id"), couponValidator, validate, couponController.updateCoupon);
router.delete("/:id", authenticate, authorize("admin"), mongoIdParamValidator("id"), validate, couponController.deleteCoupon);

export default router;
