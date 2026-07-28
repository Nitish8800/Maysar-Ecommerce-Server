import { body } from "express-validator";

export const couponValidator = [
  body("code").trim().notEmpty().withMessage("Coupon code is required."),
  body("discountType").isIn(["percentage", "fixed"]).withMessage("Discount type must be percentage or fixed."),
  body("discountValue").isFloat({ min: 0 }).withMessage("Discount value must be positive."),
  body("expiryDate").isISO8601().withMessage("Valid expiry date ISO string required."),
  body("minimumOrder").optional().isFloat({ min: 0 }),
];
