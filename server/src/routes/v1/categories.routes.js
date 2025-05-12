import categoriesController from "../../controller/v1/categories.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import express from "express";
const router = express.Router();

router.get("/categories", categoriesController.getCategories);
router.post("/category", authMiddleware, categoriesController.createCategory);
router.delete("/category", authMiddleware, categoriesController.deleteCategory);
router.patch("/category", authMiddleware, categoriesController.updateCategory);

export default router;
