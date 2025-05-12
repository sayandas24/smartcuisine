import express from "express";
import inventoryController from "../../../controller/v1/inventory.controller.js";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import verifyAdmin from "../../../middlewares/admin.middleware.js";
const router = express.Router();

router.post("/", authMiddleware, verifyAdmin, inventoryController.addItem);
router.delete("/", authMiddleware, verifyAdmin, inventoryController.deleteItem);
router.patch("/", authMiddleware, verifyAdmin, inventoryController.updateItem);

export default router;
