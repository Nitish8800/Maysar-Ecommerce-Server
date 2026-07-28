import { body } from "express-validator";

export const reviewValidator = [
  body("productId").isMongoId().withMessage("Valid Product ID required."),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer between 1 and 5."),
  body("comment").trim().notEmpty().withMessage("Comment is required."),
  body("images").optional().isArray(),
];
