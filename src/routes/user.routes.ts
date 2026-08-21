import { Router } from "express";
import {
  createUserController,
  desactivateUserController,
  getUserByIdController,
  getCurrentUser,
  listUsersController,
  updateUserController,
  reactivateUserController,
} from "../controllers/user.controller";

import { Role } from "../generated/prisma/client";
import {
  requireRole,
  requireSelfOrAdmin,
} from "../middlewares/role.middleware";

import { authMiddleware } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/me", getCurrentUser);

userRouter.get("/", requireRole(Role.ADMIN), listUsersController);

userRouter.post("/", requireRole(Role.ADMIN), createUserController);

userRouter.get("/:id", requireSelfOrAdmin, getUserByIdController);

userRouter.patch("/:id", requireSelfOrAdmin, updateUserController);

userRouter.delete("/:id", requireRole(Role.ADMIN), desactivateUserController);

userRouter.patch("/:id/reactivate", requireRole(Role.ADMIN), reactivateUserController);
