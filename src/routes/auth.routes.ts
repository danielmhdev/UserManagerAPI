import { Router } from "express";
import { registerController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/register", registerController);