// Los servicios de usuario encapsulan la lógica de negocio.

import { prisma } from "../prisma";
import { AppError } from "../errors/AppError";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} as const;

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
  return prisma.user.findMany({
    select: userSafeSelect,
    orderBy: {
      id: "asc"
    }
  });
}
// Obtiene todos los usuarios activos de forma segura.
export async function getActiveUsersService() {
  return prisma.user.findMany({
    where: {
      isActive: true
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc"
    }
  });
}

// Obtiene el conteo total de usuarios.
export async function getUsersCountService() {
  return prisma.user.count();
}

// Obtiene usuarios filtrados por rol de forma segura.
export async function getUsersByRoleService(role: "USER" | "ADMIN") {
  return prisma.user.findMany({
    where: {
      role
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc"
    }
  });
}
// Obtiene un usuario por su ID de forma segura.
export async function getUserByIdService(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: userSafeSelect
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404, { id });
  }

  return user;
}

// Buscamos el usuario por email de forma segura.
export async function getUserByEmailService(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
    select: userSafeSelect
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404, { email });
  }

  return user;
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

  try {
    return await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash: `hash_temporal_${cleanPassword}`
      },
      select: userSafeSelect
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new AppError("El email ya está registrado", 409, {
        email: cleanEmail
      });
    }

    throw error;
  }
}