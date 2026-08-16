import { Router } from "express";
import {authDebug} from "../controllers/auth.controller";

export const authRouter = Router();

// Endpoint de depuración para el controlador de autenticación
authRouter.get("/debug", authDebug);
 