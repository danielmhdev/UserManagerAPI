import { Request, Response } from "express";
// Función para manejar la ruta de salud de la API
export function getHealth(req: Request, res: Response) {
  return res.status(200).json({
    status: "ok",
    message: "UserManager API funcionando",
    timestamp: new Date().toISOString()
  });
}