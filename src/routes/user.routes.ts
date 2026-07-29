import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { updateProfileValidator, addressValidator } from "../validators/user.validator";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

// Profile
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, updateProfileValidator, validate, userController.updateProfile);

// Address CRUD
router.get("/addresses", authenticate, userController.getAddresses);
router.post("/addresses", authenticate, addressValidator, validate, userController.addAddress);
router.put("/addresses/:id", authenticate, mongoIdParamValidator("id"), addressValidator, validate, userController.updateAddress);
router.delete("/addresses/:id", authenticate, mongoIdParamValidator("id"), validate, userController.deleteAddress);
router.put("/addresses/:id/default", authenticate, mongoIdParamValidator("id"), validate, userController.setDefaultAddress);

// Wishlist CRUD
router.get("/wishlist", authenticate, userController.getWishlist);
router.post("/wishlist", authenticate, userController.addToWishlist);
router.delete("/wishlist/:productId", authenticate, mongoIdParamValidator("productId"), validate, userController.removeFromWishlist);
router.delete("/wishlist", authenticate, userController.clearWishlist);

export default router;
