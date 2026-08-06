import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

router.use(authenticate);

router.post("/process", paymentController.processPayment);
router.get("/history", paymentController.getPayments);

// Customer Payment Methods API
router.get("/methods", paymentController.getPaymentMethods);
router.post("/methods", paymentController.addPaymentMethod);
router.delete("/methods/:id", mongoIdParamValidator("id"), validate, paymentController.deletePaymentMethod);

// Razorpay Payment Routes
router.post("/razorpay/create-order", paymentController.createRazorpayOrder);
router.post("/razorpay/verify", paymentController.verifyRazorpayPayment);
router.get("/razorpay/key", paymentController.getRazorpayKey);

export default router;
