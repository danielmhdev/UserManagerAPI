import { Request, Response, NextFunction } from "express";
import { loginService, registerService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types/auth.types";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await registerService(req.body);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await loginService(req.body);

    return res.status(200).json({
      message: "Login correcto",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function meController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    return res.status(200).json({
      message: "Usuario autenticado",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
}
