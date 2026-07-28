import { Router } from "express";
import { returnController } from "../controllers/return.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { mongoIdParamValidator } from "../validators/common.validator";

const router = Router();

router.get("/", authenticate, returnController.getReturns);
router.put("/:id/status", authenticate, authorize("admin"), mongoIdParamValidator("id"), validate, returnController.updateReturnStatus);

export default router;
