// Llamamos al repositorio para obtener los datos y procesar cualquier regla del negocio
import { AppError } from "../errors/AppError";
import {
  createUser,
  deactivateUser,
  reactivateUser,
  findActiveUsers,
  findAllUsers,
  findInactiveUsers,
  findUserByEmail,
  findUserById,
  findUsersByRole,
  usersCount,
  updateUser,
} from "../repositories/user.repository";
import {
  isNonEmptyString,
  isValidBasicEmail,
  normalizeEmail,
} from "../utils/string.utils";
import { hashPassword } from "../utils/password.utils";
// Definimos un tipo para la entrada de creación de usuario
type CreateUserInput = {
  name: unknown;
  email: unknown;
  password: unknown;
};
// Definimos un tipo para la entrada de actualización de usuario
type UpdateUserInput = {
  name?: unknown;
  email?: unknown;
  isActive?: unknown;
};

//===============================
// Funciones del de usuario
//===============================
// Obtiene todos los usuarios de forma segura.
export async function listUsersService() {
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
  if (cleanRole !== "USER" && cleanRole !== "ADMIN") {
    throw new AppError("El rol debe ser 'USER' o 'ADMIN'", 400, {
      received: cleanRole,
    });
  }
  const usersByRole = await findUsersByRole(cleanRole);

  return { usersByRole, cleanRole };
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

  if (!data) {
    throw new AppError("Usuario no encontrado", 404, {
      email: cleanEmail,
    });
  }

  return data;
}

// Crea un usuario con validación y manejo de errores.
export async function createUserService(input: CreateUserInput) {
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
      email: cleanEmail,
    });
  }
  const passwordHash = await hashPassword(cleanPassword); // Hasheamos la contraseña antes de guardarla en la base de datos

  return createUser({
    name: cleanName,
    email: cleanEmail,
    passwordHash, // Guardamos el hash de la contraseña en lugar de la contraseña en texto plano
  });
}

// Actualiza un usuario con validación y manejo de errores.
export async function updateUserService(id: number, input: UpdateUserInput) {
  const currentUser = await findUserById(id);

  if (!currentUser) {
    throw new AppError("Usuario no encontrado", 404, { id });
  }

  const dataToUpdate: {
    name?: string;
    email?: string;
    isActive?: boolean;
  } = {};

  if (input.name !== undefined) {
    if (!isNonEmptyString(input.name)) {
      throw new AppError("El nombre debe ser un texto no vacío", 400);
    }

    dataToUpdate.name = input.name.trim();
  }

  if (input.email !== undefined) {
    if (!isNonEmptyString(input.email)) {
      throw new AppError("El email debe ser un texto no vacío", 400);
    }

    const cleanEmail = normalizeEmail(input.email);

    if (!isValidBasicEmail(cleanEmail)) {
      throw new AppError("El email no tiene un formato válido", 400);
    }

    const existingUser = await findUserByEmail(cleanEmail);

    if (existingUser && existingUser.id !== id) {
      throw new AppError("El email ya está registrado", 409, {
        email: cleanEmail,
      });
    }

    dataToUpdate.email = cleanEmail;
  }

  if (input.isActive !== undefined) {
    if (typeof input.isActive !== "boolean") {
      throw new AppError("isActive debe ser true o false", 400);
    }

    dataToUpdate.isActive = input.isActive;
  }

  const hasChanges = Object.keys(dataToUpdate).length > 0;

  if (!hasChanges) {
    throw new AppError("Debes enviar al menos un campo para actualizar", 400);
  }

  return updateUser(id, dataToUpdate);
}

// Desactiva un usuario
export async function deactivateUserService(id: number) {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404, { id });
  }

  if (!user.isActive) {
    throw new AppError("El usuario ya estaba desactivado", 409, { id });
  }

  return deactivateUser(id);
}

// Reactiva un usuario
export async function reactivateUserService(id: number) {
  const user = await findUserById(id);

  if (!user) {
    throw new AppError("Usuario no encontrado", 404, { id });
  }

  if (user.isActive) {
    throw new AppError("El usuario ya estaba activo", 409, { id });
  }

  return reactivateUser(id);
}

export async function getCurrentUserService(userId: number) {
  return getUserByIdService(userId);
}