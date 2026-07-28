import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProductValidator, updateProductValidator } from "../validators/product.validator";
import { paginationValidator, mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

// Public routes
router.get("/", paginationValidator, validate, productController.getProducts);
router.get("/:identifier", productController.getProductDetails);

// Admin protected routes
router.post(
    "/",
    authenticate,
    authorize("admin"),
    createProductValidator,
    validate,
    productController.createProduct
);

router.put(
    "/:id",
    authenticate,
    authorize("admin"),
    mongoIdParamValidator("id"),
    updateProductValidator,
    validate,
    productController.updateProduct
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    mongoIdParamValidator("id"),
    validate,
    productController.deleteProduct
);

export default router;