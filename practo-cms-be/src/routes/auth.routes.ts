/**
 * Auth Routes
 */

import { Router } from "express";
import { 
  loginController, 
  googleOAuthController,
  getMeController,
  changePasswordController, 
  setPasswordController,
  refreshTokenController,
  forgotPasswordController,
  verifyResetTokenController,
  resetPasswordController
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/login", loginController);
router.post("/oauth/google", googleOAuthController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-reset-token", verifyResetTokenController);
router.post("/reset-password", resetPasswordController);

// Protected routes
router.get("/me", authenticate, getMeController);
router.post("/refresh", authenticate, refreshTokenController);
router.post("/change-password", authenticate, changePasswordController);
router.post("/set-password", authenticate, setPasswordController);

export default router;
