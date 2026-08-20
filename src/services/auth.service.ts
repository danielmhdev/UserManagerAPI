// Aqui guardaremos la lógica de autenticación
import { AppError } from "../errors/AppError";
import { createUser, findUserByEmail, findUserByEmailWithPassword  } from "../repositories/user.repository";
import { comparePassword, hashPassword } from "../utils/password.utils";
import {
  isNonEmptyString,
  isValidBasicEmail,
  normalizeEmail,
} from "../utils/string.utils";

type RegisterInput = {
  name: unknown;
  email: unknown;
  password: unknown;
};

type LoginInput = {
  email: unknown;
  password: unknown;
};

export async function registerService(input: RegisterInput) {
  const { name, email, password } = input;

  if (!isNonEmptyString(name)) {
    throw new AppError("El nombre debe ser un texto no vacío", 400);
  }

  if (!isNonEmptyString(email)) {
    throw new AppError("El email debe ser un texto no vacío", 400);
  }

  if (!isNonEmptyString(password)) {
    throw new AppError("La contraseña debe ser un texto no vacío", 400);
  }

  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = password.trim();

  if (!isValidBasicEmail(cleanEmail)) {
    throw new AppError("El email no tiene un formato válido", 400);
  }

  if (cleanPassword.length < 6) {
    throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
  }

  const existingUser = await findUserByEmail(cleanEmail);

  if (existingUser) {
    throw new AppError("El email ya está registrado", 409, {
      email: cleanEmail
    });
  }

  const passwordHash = await hashPassword(cleanPassword);

  return createUser({
    name: cleanName,
    email: cleanEmail,
    passwordHash
  });
}
// Quitamos passwordHasg del objeto usuario antes de devolverlo al cliente.
function removePasswordHash<T extends { passwordHash: string }>(user: T) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

// Login de usuario
export async function loginService(input: LoginInput) {
  const { email, password } = input;

  if (!isNonEmptyString(email)) {
    throw new AppError("El email debe ser un texto no vacío", 400);
  }

  if (!isNonEmptyString(password)) {
    throw new AppError("La contraseña debe ser un texto no vacío", 400);
  }

  const cleanEmail = normalizeEmail(email);
  const cleanPassword = password.trim();

  if (!isValidBasicEmail(cleanEmail)) {
    throw new AppError("El email no tiene un formato válido", 400);
  }

  const user = await findUserByEmailWithPassword(cleanEmail);

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const passwordMatches = await comparePassword(
    cleanPassword,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new AppError("Credenciales inválidas", 401);
  }

  if (!user.isActive) {
    throw new AppError("El usuario está desactivado", 403);
  }

  const safeUser = removePasswordHash(user);

  return {
    user: safeUser
  };
}