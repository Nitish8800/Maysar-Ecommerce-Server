import { body } from "express-validator";

export const createOrderValidator = [
  body("shippingAddress").isObject().withMessage("Shipping address object is required."),
  body("shippingAddress.firstName").notEmpty().withMessage("First name is required."),
  body("shippingAddress.lastName").notEmpty().withMessage("Last name is required."),
  body("shippingAddress.addressLine1").notEmpty().withMessage("Address line 1 is required."),
  body("shippingAddress.city").notEmpty().withMessage("City is required."),
  body("shippingAddress.state").notEmpty().withMessage("State is required."),
  body("shippingAddress.country").notEmpty().withMessage("Country is required."),
  body("shippingAddress.zipCode").notEmpty().withMessage("Zip code is required."),
  body("billingAddress").isObject().withMessage("Billing address object is required."),
  body("paymentMethod").notEmpty().withMessage("Payment method is required."),
  body("couponCode").optional().trim().isString(),
];

export const updateOrderStatusValidator = [
  body("orderStatus")
    .isIn(["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"])
    .withMessage("Invalid order status."),
  body("trackingNumber").optional().trim().isString(),
];

export const returnOrderValidator = [
  body("reason").trim().notEmpty().withMessage("Return reason is required."),
  body("description").optional().trim(),
];
