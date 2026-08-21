import { Response, NextFunction } from "express";
import { Role } from "../generated/prisma/client";
import { AppError } from "../errors/AppError";
import { AuthenticatedRequest } from "../types/auth.types";

export function requireRole(...allowedRoles: Role[]) {
  return function (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user) {
        throw new AppError("Usuario no autenticado", 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError("No tienes permiso para realizar esta acción", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Permite dos casos, si es ADMIN puede acceder a cualquier usuario o si es USER puede acceder solo a su propio usuario.
export function requireSelfOrAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    const requestedUserId = Number(req.params.id);

    if (Number.isNaN(requestedUserId)) {
      throw new AppError("El ID debe ser un número", 400, {
        received: req.params.id,
      });
    }

    const isAdmin = req.user.role === Role.ADMIN;
    const isSelf = req.user.userId === requestedUserId;

    if (!isAdmin && !isSelf) {
      throw new AppError("No tienes permiso para acceder a este usuario", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}
