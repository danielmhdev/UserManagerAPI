// Los controladores de usuario manejan las solicitudes HTTP y delegan la lógica de negocio a los servicios.
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { parseIdParam } from "../utils/parse.utils";
import {
  createUserService,
  getActiveUsersService,
  getInactiveUsersService,
  getUserByIdService,
  getUserByEmailService,
  listUsersService,
  getUsersCountService,
  getUsersByRoleService,
  updateUserService,
  deactivateUserService,
  reactivateUserService,
} from "../services/user.service";

// Función de listado de usuarios
export async function listUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const activeQuery = req.query.active; // Obtenemos el parámetro de consulta 'active' de la solicitud http. Este parámetro puede ser 'true', 'false' o no estar presente.
    if (!activeQuery) {
      const users = await listUsersService(); // Llamamos al servicio para obtener todos los usuarios de forma segura
      return res.status(200).json({
        message: "Usuarios obtenidos correctamente",
        total: users.length,
        data: users,
      });
    }
    if (activeQuery !== "true" && activeQuery !== "false") {
      throw new AppError(
        "El parámetro 'active' solo puede ser 'true' o 'false'",
        400,
        {
          received: activeQuery,
        },
      );
    }

    if (activeQuery === "true") {
      const activeUsers = await getActiveUsersService();

      return res.status(200).json({
        message: "Lista de usuarios activos",
        total: activeUsers.length,
        data: activeUsers,
      });
    }

    if (activeQuery === "false") {
      const inactiveUsers = await getInactiveUsersService();

      return res.status(200).json({
        message: "Lista de usuarios inactivos",
        total: inactiveUsers.length,
        data: inactiveUsers,
      });
    }
  } catch (error) {
    next(error);
  }
}
// Función para obtener todos los usuarios activos
export async function getActiveUsersController( // Es async porque asi podemos usar await dentro de la funcion para esperar a que la promesa de prisma.user.findMany se resuelva antes de continuar con la ejecución del código.
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await getActiveUsersService();

    return res.status(200).json({
      message: "Usuarios activos obtenidos correctamente",
      total: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener todos los usuarios inactivos
export async function getInactiveUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await getInactiveUsersService();

    return res.status(200).json({
      message: "Usuarios Inactivos obtenidos correctamente",
      total: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener el conteo total de usuarios
export async function getUsersCountController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const total = await getUsersCountService();
    return res.status(200).json({
      message: "Conteo de usuarios",
      total,
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener un usuario filtrado por ROl
export async function getUsersByRoleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const role = String(req.params.role);

    const { usersByRole, cleanRole } = await getUsersByRoleService(role);

    return res.status(200).json({
      message: `Listado de usuarios con rol '${cleanRole}'`,
      total: usersByRole.length,
      data: usersByRole,
    });
  } catch (error) {
    next(error);
  }
}

// Funcion para buscar un usuario por email
export async function getUserByEmailController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const email = String(req.params.email);
    const data = await getUserByEmailService(email);

    res.status(200).json({
      message: "Búsqueda de usuario por email",
      data: data,
    });
  } catch (error) {
    next(error);
  }
}
// Función para identificar un usuario por ID
export async function getUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseIdParam(req.params.id as string); // Usamos la función parseIdParam para validar y convertir el parámetro de ID a número. Si el ID no es un número válido, se lanzará un AppError.

    const user = await getUserByIdService(id);

    return res.status(200).json({
      message: "Usuario encontrado",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// Funcion para crear un usuario de prueba
export async function createUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const createdUser = await createUserService(req.body);

    return res.status(201).json({
      message: "Usuario creado",
      data: createdUser,
    });
  } catch (error) {
    next(error);
  }
}
// Función para actualizar un usuario existente
export async function updateUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseIdParam(req.params.id as string); // Usamos la función parseIdParam para validar y convertir el parámetro de ID a número. Si el ID no es un número válido, se lanzará un AppError.

    const updatedUser = await updateUserService(id, req.body);

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

// Función para desactivar un usuario existente
export async function desactivateUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseIdParam(req.params.id as string);
    const deactivatedUser = await deactivateUserService(id);

    return res.status(200).json({
      message: "Usuario desactivado correctamente",
      data: deactivatedUser,
    });
  } catch (error) {
    next(error);
  }
}

// Función para reactivar un usuario existente
export async function reactivateUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = parseIdParam(req.params.id as string);
    const reactivatedUser = await reactivateUserService(id);

    return res.status(200).json({
      message: "Usuario reactivado correctamente",
      data: reactivatedUser,
    });
  } catch (error) {
    next(error);
  }
}
