// Encargado de acceder a los datos usando Prisma para leer y escribir usuarios en PostgreSQL.
import { Role } from "../generated/prisma/client";
import { prisma } from "../prisma";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;
// Datos que el repo necesita para crear el usuario.
type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role?: Role;
  isActive?: boolean;
};

// Datos que el repo necesita para actualizar el usuario.
type UpdateUserData = {
  name?: string;
  email?: string;
  isActive?: boolean;
};

// Devuelve todos los usuario de la base de datos
export function findAllUsers() {
  return prisma.user.findMany({
    select: userSafeSelect,
    orderBy: {
      id: "asc",
    },
  });
}
// Devuelve todos los usuarios activos de la base de datos
export function findActiveUsers() {
  return prisma.user.findMany({
    where: {
      isActive: true,
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc",
    },
  });
}
// Devuelve todos los usuarios inactivos de la base de datos
export function findInactiveUsers() {
  return prisma.user.findMany({
    where: {
      isActive: false,
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc",
    },
  });
}
// Devuelve el conteo total de usuarios
export function usersCount() {
  return prisma.user.count();
}

// Devuelve usuarios filtrados por rol de la base de datos
export function findUsersByRole(role: Role) {
  return prisma.user.findMany({
    where: {
      role,
    },
    select: userSafeSelect,
    orderBy: {
      id: "asc",
    },
  });
}

// Devuelve los usuarios por Id
export function findUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: userSafeSelect,
  });
}
// Devuelve usuarios por email
export function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userSafeSelect,
  });
}
// Crearemos usuarios
export function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
    select: userSafeSelect,
  });
}
// Actualizamos usuarios
export function updateUser(id: number, data: UpdateUserData) {
  return prisma.user.update({
    where: {
      id,
    },
    data,
    select: userSafeSelect,
  });
}

// Eliminamos usuarios
export function deactivateUser(id: number) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
    select: userSafeSelect,
  });
}

// Reactivamos usuarios
export function reactivateUser(id: number) {
  return prisma.user.update({
    where: {
      id,
    },
    data: {
      isActive: true,
    },
    select: userSafeSelect,
  });
}
