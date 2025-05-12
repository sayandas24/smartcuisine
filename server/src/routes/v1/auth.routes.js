import authController from "../../controller/v1/auth.controller.js";
import express from "express";

const router = express.Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

export default router;
