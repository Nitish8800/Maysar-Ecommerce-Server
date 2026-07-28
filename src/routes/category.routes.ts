import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { categoryValidator } from "../validators/category.validator";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

// Public routes
router.get("/", categoryController.getCategories);
router.get("/:id", mongoIdParamValidator("id"), validate, categoryController.getCategoryById);

// Admin routes
router.post("/", authenticate, authorize("admin"), categoryValidator, validate, categoryController.createCategory);
router.put("/:id", authenticate, authorize("admin"), mongoIdParamValidator("id"), categoryValidator, validate, categoryController.updateCategory);
router.delete("/:id", authenticate, authorize("admin"), mongoIdParamValidator("id"), validate, categoryController.deleteCategory);

export default router;
