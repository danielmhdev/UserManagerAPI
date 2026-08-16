import { Router } from "express";
import { prisma } from "../prisma"; // Importamos la instancia de Prisma desde el archivo prisma.ts

export const authRouter = Router();

authRouter.get("/debug", async (req, res, next) => {
    try {
        return res.status(200).json({
            message: "Auth routes preparadas",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});