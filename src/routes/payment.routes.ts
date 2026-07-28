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

export default router;
