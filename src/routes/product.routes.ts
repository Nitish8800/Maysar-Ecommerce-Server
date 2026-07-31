import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { handleThumbnailUpload, handleGalleryUpload } from "../controllers/upload.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProductValidator, updateProductValidator } from "../validators/product.validator";
import { paginationValidator, mongoIdParamValidator } from "../validators/common.validator";
import { uploadProductThumbnail, uploadProductGallery } from "../middleware/upload.middleware";

const router = Router();

// Public routes
router.get("/", paginationValidator, validate, productController.getProducts);
router.get("/:identifier", productController.getProductDetails);

// ── Cloudinary Upload Endpoints (Admin only) ─────────────────────────────────
router.post(
    "/upload/thumbnail",
    authenticate,
    authorize("admin"),
    uploadProductThumbnail,
    handleThumbnailUpload
);

router.post(
    "/upload/gallery",
    authenticate,
    authorize("admin"),
    uploadProductGallery,
    handleGalleryUpload
);

// Admin protected CRUD routes
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