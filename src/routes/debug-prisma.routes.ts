import { Router } from "express";
import {
  createDebugUserController,
  getActiveUsersController,
  getUserByIdController,
  getUsersController,
  getUsersByRoleController,
  getUsersCountController,
  getUserByEmailController
} from "../controllers/user.controller";

export const debugPrismaRouter = Router();
 
// Endpoint para obtener listado de todos los usuarios usando Prisma
debugPrismaRouter.get("/users", getUsersController);

// Rutas de depuración para Prisma
debugPrismaRouter.get("/users-active", getActiveUsersController);

// Endpoint de conteo total de usuarios usando Prisma
debugPrismaRouter.get("/users-count", getUsersCountController);

// Endpoint para añidir filtro por rol
debugPrismaRouter.get("/users-role/:role", getUsersByRoleController);

// Endpoint para obtener un usuario por id usando Prisma
debugPrismaRouter.get("/users/:id", getUserByIdController);

// Endpoint para crear un nuevo usuario usando Prisma
debugPrismaRouter.post("/users", createDebugUserController);

//Endpoint para buscar un usuario por email usando Prisma
debugPrismaRouter.get("/users-by-email/:email", getUserByEmailController);