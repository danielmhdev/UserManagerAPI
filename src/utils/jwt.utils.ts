import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../errors/AppError";

type JwtPayload = {
  userId: number;
  email: string;
  role: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET no está configurado", 500);
  }

  return secret;
}

function getJwtSignOptions(): SignOptions {
  return {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "1h"
  };
}

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), getJwtSignOptions());
}