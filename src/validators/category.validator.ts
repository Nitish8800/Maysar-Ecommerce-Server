import { body } from "express-validator";

export const categoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required."),
  body("description").optional().trim(),
  body("parentCategory").optional().isMongoId().withMessage("Parent category must be a valid ObjectId."),
];
