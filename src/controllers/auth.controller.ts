import { Request, Response, NextFunction } from "express";
import { registerService } from "../services/auth.service";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await registerService(req.body);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      data: user
    });
  } catch (error) {
    next(error);
  }
}