import express from "express";
import inventoryController from "../../controller/v1/inventory.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", inventoryController.getItems);
export default router;
