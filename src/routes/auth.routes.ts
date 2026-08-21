import { Router } from "express";
import {
  loginController,
  registerController,
  meController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

authRouter.get("/me", authMiddleware, meController);
