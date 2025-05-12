import express from "express";
import deleteOtps from "../../cron_jobs/otps.cron.js";
const router = express.Router();

router.get("/otps", deleteOtps);

export default router;
