import { Request, Response } from "express";

// Función de depuración para el controlador de autenticación
export function authDebug(req: Request, res: Response) {
  return res.status(200).json({
    message: "Auth controller preparado",
    timestamp: new Date().toISOString()
  });
}