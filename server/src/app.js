import express from "express";
import userRoutes from "./routes/v1/user.routes.js";
import authRoutes from "./routes/v1/auth.routes.js";
import systemRoutes from "./routes/v1/system.routes.js";
import categoriesRoutes from "./routes/v1/categories.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import sanitizeInput from "./middlewares/sanitizeInputs.middleware.js";
import rateLimit from "express-rate-limit";

import inventoryRoutes from "./routes/v1/admin/inventory.routes.js";
import userInventoryRoutes from "./routes/v1/inventory.routes.js";
//Admin routes
import adminAuthRoutes from "./routes/v1/admin/auth.routes.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://apna-restaurant-xyz.vercel.app",
      "http://localhost:5100",
      "http://192.168.0.106:5100",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Credentials",
    ],
    credentials: true,
  })
);

// Limiting requests per minute
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 50,
  message: { error: "Too many requests, please try again later." },
  headers: true,
});
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("v10");
});
// v1 user APIs
app.use("/api/v1/users", sanitizeInput, userRoutes);
app.use("/api/v1/users/auth", sanitizeInput, authRoutes);
app.use("/system", sanitizeInput, systemRoutes);
app.use("/api/v1/", sanitizeInput, categoriesRoutes);
app.use("/api/v1/inventory", userInventoryRoutes);
// Admin Apis
app.use("/api/v1/admin/auth", sanitizeInput, adminAuthRoutes);
app.use("/api/v1/admin/inventory", sanitizeInput, inventoryRoutes);
export default app;
