import express from "express";
import useController from "../../controller/v1/user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.delete("/", authMiddleware, useController.deleteUser);
router.patch("/", authMiddleware, useController.updateUser);
router.get("/verify", useController.verifyUser);
router.post("/verify", useController.generateOTP);
router.get("/check", useController.checkUser);
router.get("/", authMiddleware, useController.getUser);

export default router;
