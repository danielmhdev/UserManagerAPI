import { Router } from "express";
import {
  createUserController,
  desactivateUserController,
  getUserByIdController,
  listUsersController,
  updateUserController,
  reactivateUserController,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get("/", listUsersController);

userRouter.get("/:id", getUserByIdController);

userRouter.post("/", createUserController);

userRouter.patch("/:id", updateUserController);

userRouter.delete("/:id", desactivateUserController);

userRouter.patch("/:id/reactivate", reactivateUserController);
