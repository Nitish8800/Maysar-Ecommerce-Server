import { body } from "express-validator";

export const updateProfileValidator = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
  body("phone").optional().trim().isMobilePhone("any").withMessage("Invalid phone number."),
  body("avatar").optional().trim().isURL().withMessage("Avatar must be a valid URL."),
];

export const addressValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required."),
  body("lastName").trim().notEmpty().withMessage("Last name is required."),
  body("phone").trim().notEmpty().withMessage("Phone is required."),
  body("country").trim().notEmpty().withMessage("Country is required."),
  body("state").trim().notEmpty().withMessage("State is required."),
  body("city").trim().notEmpty().withMessage("City is required."),
  body("zipCode").trim().notEmpty().withMessage("Zip code is required."),
  body("addressLine1").trim().notEmpty().withMessage("Address line 1 is required."),
  body("addressLine2").optional().trim(),
  body("landmark").optional().trim(),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean."),
];
