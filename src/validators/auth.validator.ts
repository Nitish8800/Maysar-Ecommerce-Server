import { body } from "express-validator";

export const sendSignupOtpValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").trim().isEmail().withMessage("Please provide a valid email address."),
  body("phone").optional().trim().isMobilePhone("any").withMessage("Please provide a valid phone number."),
];

export const verifySignupOtpValidator = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address."),
  body("otp").trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage("OTP must be a 6-digit numeric code."),
];

export const sendLoginOtpValidator = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address."),
];

export const verifyLoginOtpValidator = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address."),
  body("otp").trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage("OTP must be a 6-digit numeric code."),
];

export const resendOtpValidator = [
  body("email").trim().isEmail().withMessage("Please provide a valid email address."),
  body("purpose").trim().isIn(["signup", "login"]).withMessage("Purpose must be 'signup' or 'login'."),
];
