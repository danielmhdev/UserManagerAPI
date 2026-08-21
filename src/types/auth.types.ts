// Aquí guardamos la petición cuando el usuario esté autenticado.
import { Request } from "express";
import { Role } from "../generated/prisma/client";

export type AuthenticatedUser = {
  userId: number;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};