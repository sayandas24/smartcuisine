import express from "express";
import authController from "../../../controller/v1/auth.controller.js";
import adminFlag from "../../../middlewares/adminFlag.middleware.js";
const router = express.Router();

router.post("/login", adminFlag, authController.login);

export default router;
