import { Router } from "express";
import {
  createDebugUserController,
  getActiveUsersController,
  getInactiveUsersController,
  getUserByIdController,
  getUsersController,
  getUsersByRoleController,
  getUsersCountController,
  getUserByEmailController
} from "../controllers/user.controller";

export const debugPrismaRouter = Router();
 
// Endpoint para obtener listado de todos los usuarios usando Prisma
debugPrismaRouter.get("/users", getUsersController);

// Rutas para obtener usuarios activos
debugPrismaRouter.get("/users-active", getActiveUsersController);

//Ruta para obtener usuarios inactivos
debugPrismaRouter.get("/users-inactive", getInactiveUsersController);

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