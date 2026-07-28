import { param, query } from "express-validator";

export const mongoIdParamValidator = (paramName: string = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} parameter.`),
];

export const paginationValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
  query("search").optional().isString().trim(),
  query("sort").optional().isString().trim(),
];
