// Llamamos al repositorio para obtener los datos y procesar cualquier regla del negocio
import { AppError } from "../errors/AppError";
import { Role } from "../generated/prisma";

import {
  createUser,
  findActiveUsers,
  findAllUsers,
  findInactiveUsers,
  findUserByEmail,
  findUserById,
  findUsersByRole,
  usersCount
} from "../repositories/user.repository";

// Definimos un tipo para la entrada de creación de usuario 
type CreateDebugUserInput = {
  name: unknown;
  email: unknown;
  password: unknown;
};

//================================
//Funciones auxiliares para validar y normalizar datos de usuario
//================================
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidBasicEmail(email: string): boolean {
  return email.includes("@") && email.includes(".");
}

//===============================
// Funciones del de usuario
//===============================
// Obtiene todos los usuarios de forma segura.
export async function getUsersService() {
  return findAllUsers();
}
// Obtiene todos los usuarios activos de forma segura.
export async function getActiveUsersService() {
  return findActiveUsers();
}
// Obtiene todos los usuarios inactivos de forma segura.
export async function getInactiveUsersService() {
  return findInactiveUsers();
}
// Obtiene el conteo total de usuarios.
export async function getUsersCountService() {
  return usersCount();
}

// Obtiene usuarios filtrados por rol de forma segura.
export async function getUsersByRoleService(role: string) {
  const cleanRole = String(role).trim().toUpperCase();
  // Validación de entrada (responsabilidad del servicio)
  if (role !== "USER" && role !== "ADMIN") {
     throw new AppError("El rol debe ser 'USER' o 'ADMIN'", 400, {
      received: cleanRole,
    })
  }
  const usersByRole = await findUsersByRole(cleanRole as Role);


  return {usersByRole, cleanRole};
}
// Obtiene un usuario por su ID de forma segura.
export async function getUserByIdService(id: number) {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404, { id });
  }

  return user;
}

// Buscamos el usuario por email de forma segura.
export async function getUserByEmailService(email: string) {
    
    const cleanEmail = normalizeEmail(email);

    const data = await findUserByEmail(email);

    if(!data) {
        throw new AppError("Usuario no encontrado", 404, {
            email: cleanEmail
        })
    }

    return data;
}

// Crea un usuario de depuración con validación y manejo de errores.
export async function createDebugUserService(input: CreateDebugUserInput) {
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

  return createUser({
    name: cleanName,
    email: cleanEmail,
    passwordHash: `hash_temporal_${cleanPassword}`
  });
}