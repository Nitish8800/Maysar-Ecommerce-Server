import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { reviewValidator } from "../validators/review.validator";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

router.get("/product/:productId", mongoIdParamValidator("productId"), validate, reviewController.getProductReviews);
router.post("/", authenticate, reviewValidator, validate, reviewController.addReview);
router.delete("/:id", authenticate, authorize("admin"), mongoIdParamValidator("id"), validate, reviewController.deleteReview);

export default router;
