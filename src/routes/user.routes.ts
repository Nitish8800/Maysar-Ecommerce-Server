import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProfileValidator, addressValidator } from "../validators/user.validator";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

router.use(authenticate);

// Profile
router.get("/profile", userController.getProfile);
router.put("/profile", updateProfileValidator, validate, userController.updateProfile);

// Address CRUD
router.get("/addresses", userController.getAddresses);
router.post("/addresses", addressValidator, validate, userController.addAddress);
router.put("/addresses/:id", mongoIdParamValidator("id"), addressValidator, validate, userController.updateAddress);
router.delete("/addresses/:id", mongoIdParamValidator("id"), validate, userController.deleteAddress);
router.put("/addresses/:id/default", mongoIdParamValidator("id"), validate, userController.setDefaultAddress);

// Wishlist CRUD
router.get("/wishlist", userController.getWishlist);
router.post("/wishlist", userController.addToWishlist);
router.delete("/wishlist/:productId", mongoIdParamValidator("productId"), validate, userController.removeFromWishlist);
router.delete("/wishlist", userController.clearWishlist);

export default router;
