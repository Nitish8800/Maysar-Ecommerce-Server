import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createOrderValidator, returnOrderValidator } from "../validators/order.validator";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

router.use(authenticate);

router.post("/", createOrderValidator, validate, orderController.createOrder);
router.get("/", orderController.getCustomerOrders);
router.get("/:id", mongoIdParamValidator("id"), validate, orderController.getOrderDetails);
router.put("/:id/cancel", mongoIdParamValidator("id"), validate, orderController.cancelOrder);
router.get("/:id/track", mongoIdParamValidator("id"), validate, orderController.trackOrder);
router.post("/:id/return", mongoIdParamValidator("id"), returnOrderValidator, validate, orderController.returnOrder);

export default router;
