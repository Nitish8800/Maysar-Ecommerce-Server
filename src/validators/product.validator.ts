import { body } from "express-validator";

export const createProductValidator = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("brand").trim().notEmpty().withMessage("Brand is required."),
  body("category").isMongoId().withMessage("Valid category ObjectId is required."),
  body("SKU").trim().notEmpty().withMessage("SKU is required."),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be an integer >= 0."),

  // Packs validation — at least one pack is required, each must have sachets + price + pricePerServing
  body("packs").isArray({ min: 1 }).withMessage("At least one pack option is required."),
  body("packs.*.name").optional().isString().trim(),
  body("packs.*.sku").optional().isString().trim(),
  body("packs.*.sachets").isInt({ min: 1 }).withMessage("Each pack must have a valid sachet count."),
  body("packs.*.price").isFloat({ min: 0 }).withMessage("Each pack must have a valid price."),
  body("packs.*.pricePerServing").isFloat({ min: 0 }).withMessage("Each pack must have a valid per-serving price."),
  body("packs.*.savings").optional().isFloat({ min: 0 }),
  body("packs.*.isBestValue").optional().isBoolean(),
  body("brandColor").optional().isString().trim(),
  body("bgColor").optional().isString().trim(),
];

export const updateProductValidator = [
  body("title").optional().trim().notEmpty(),
  body("stock").optional().isInt({ min: 0 }),
  body("category").optional().isMongoId(),
  body("brandColor").optional().isString().trim(),
  body("bgColor").optional().isString().trim(),

  // Packs update validation
  body("packs").optional().isArray({ min: 1 }).withMessage("At least one pack option is required."),
  body("packs.*.name").optional().isString().trim(),
  body("packs.*.sku").optional().isString().trim(),
  body("packs.*.sachets").optional().isInt({ min: 1 }),
  body("packs.*.price").optional().isFloat({ min: 0 }),
  body("packs.*.pricePerServing").optional().isFloat({ min: 0 }),
  body("packs.*.savings").optional().isFloat({ min: 0 }),
  body("packs.*.isBestValue").optional().isBoolean(),
];
