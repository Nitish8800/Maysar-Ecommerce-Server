import { body } from "express-validator";

export const createProductValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("brand").trim().notEmpty().withMessage("Brand is required."),
  body("category").isMongoId().withMessage("Valid category ObjectId is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number."),
  body("salePrice").optional().isFloat({ min: 0 }).withMessage("Sale price must be a non-negative number."),
  body("SKU").trim().notEmpty().withMessage("SKU is required."),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be an integer >= 0."),
  body("thumbnail").trim().notEmpty().withMessage("Thumbnail URL is required."),
];

export const updateProductValidator = [
  body("title").optional().trim().notEmpty(),
  body("price").optional().isFloat({ min: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  body("category").optional().isMongoId(),
];
