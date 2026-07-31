import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addToCartValidator, updateCartItemValidator } from "../validators/cart.validator";

const router = Router();

router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/", addToCartValidator, validate, cartController.addToCart);
router.put("/items/:productId", updateCartItemValidator, validate, cartController.updateCartItem);
router.delete("/items/:productId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);

export default router;
