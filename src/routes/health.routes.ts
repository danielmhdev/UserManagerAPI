import { Router } from "express";
import { getHealth } from "../controllers/health.controller"; // Importamos la función getHealth desde el archivo health.controller.ts

export const healthRouter = Router();

healthRouter.get("/", getHealth); // Endpoint para verificar el estado de salud de la API