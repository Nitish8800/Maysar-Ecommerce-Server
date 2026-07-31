import { body } from "express-validator";

export const addToCartValidator = [
  body("productId").trim().notEmpty().withMessage("Product ID is required."),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1."),
];

export const updateCartItemValidator = [
  body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer."),
];
