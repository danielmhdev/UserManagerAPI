import { Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "../types/auth.types";
import { verifyToken } from "../utils/jwt.utils";

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Token no proporcionado", 401);
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      throw new AppError("Formato de token inválido", 401);
    }

    const authenticatedUser = verifyToken(token);

    req.user = authenticatedUser;

    next();
  } catch (error) {
    next(error);
  }
}