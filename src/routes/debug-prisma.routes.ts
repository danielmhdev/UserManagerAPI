import { Router } from "express";
import {
  createDebugUser,
  getActiveUsers,
  getUserById,
  getUsers,
  getUsersByRole,
  getUsersCount
} from "../controllers/user.controller";

export const debugPrismaRouter = Router();
 
// Endpoint para obtener listado de todos los usuarios usando Prisma
debugPrismaRouter.get("/users", getUsers);

// Rutas de depuración para Prisma
debugPrismaRouter.get("/users-active", getActiveUsers);

// Endpoint de conteo total de usuarios usando Prisma
debugPrismaRouter.get("/users-count",getUsersCount);

// Endpoint para añidir filtro por rol
debugPrismaRouter.get("/users-role/:role", getUsersByRole);

// Endpoint para obtener un usuario por id usando Prisma
debugPrismaRouter.get("/users/:id", getUserById);


// Endpoint para crear un nuevo usuario usando Prisma
debugPrismaRouter.post("/users", createDebugUser);
