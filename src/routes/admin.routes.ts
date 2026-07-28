import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { paymentController } from "../controllers/payment.controller";
import { returnController } from "../controllers/return.controller";
import { reviewController } from "../controllers/review.controller";
import { orderController } from "../controllers/order.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateOrderStatusValidator } from "../validators/order.validator";
import { mongoIdParamValidator, paginationValidator } from "../validators/common.validator";

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize("admin"));

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// Customers Management
router.get("/customers", paginationValidator, validate, adminController.getCustomers);
router.put("/customers/:id/status", mongoIdParamValidator("id"), validate, adminController.updateCustomerStatus);

// Inventory Management
router.put("/inventory/:productId", mongoIdParamValidator("productId"), validate, adminController.updateInventory);

// Orders Management
router.put("/orders/:id/status", mongoIdParamValidator("id"), updateOrderStatusValidator, validate, adminController.updateOrderStatus);

// Reports
router.get("/reports", adminController.getReports);

// Reviews Admin
router.delete("/reviews/:id", mongoIdParamValidator("id"), validate, reviewController.deleteReview);

// Returns Admin
router.get("/returns", returnController.getReturns);
router.put("/returns/:id/status", mongoIdParamValidator("id"), validate, returnController.updateReturnStatus);

// Payments Admin
router.get("/payments", paymentController.getPayments);

// Shipping
router.get("/shipping", (req, res) => res.json({ success: true, data: { standardRate: 10, freeThreshold: 100 } }));
router.put("/shipping/rates", (req, res) => res.json({ success: true, message: "Shipping rates updated.", data: req.body }));

// Notifications Admin
router.post("/notifications/broadcast", adminController.broadcastNotification);

// Settings Admin
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

export default router;
