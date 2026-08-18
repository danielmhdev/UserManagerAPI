import { Router } from "express";
import {
  createUserController,
  desactivateUserController,
  getUserByIdController,
  listUsersController,
  updateUserController,
  reactivateUserController
} from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/", listUsersController);

userRouter.get("/:id", getUserByIdController);

userRouter.post("/", createUserController);

userRouter.patch("/:id", updateUserController);

userRouter.delete("/:id", desactivateUserController);

userRouter.patch("/:id/reactivate", reactivateUserController);