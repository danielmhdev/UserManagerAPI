// Los controladores de usuario manejan las solicitudes HTTP y delegan la lógica de negocio a los servicios.
import { Request, Response, NextFunction } from "express";
import {
  createDebugUserService,
  getActiveUsersService,
  getUserByIdService,
  getUserByEmailService,
  getUsersService,
  getUsersCountService,
  getUsersByRoleService
} from "../services/user.service";
import { AppError } from "../errors/AppError";

// Función de listado de usuarios usando Prisma
export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getUsersService(); // Llamamos al servicio para obtener todos los usuarios de forma segura

    return res.status(200).json({
      message: "Usuarios obtenidos con Prisma",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener todos los usuarios activos usando Prisma
export async function getActiveUsersController( // Es async porque asi podemos usar await dentro de la funcion para esperar a que la promesa de prisma.user.findMany se resuelva antes de continuar con la ejecución del código.
req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getActiveUsersService();

    return res.status(200).json({
      message: "Usuarios activos obtenidos con Prisma",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}

// Función para obtener el conteo total de usuarios usando Prisma
export async function getUsersCountController(
  req: Request,
  res: Response,
  next: NextFunction
) {try {
    const total = await getUsersCountService();
    return res.status(200).json({
      message: "Conteo de usuarios obtenido con Prisma",
      total
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener un usuario filtrado por ROl usando prisma
export async function getUsersByRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { role } = req.params;

    // Validación de entrada (responsabilidad del controlador)
    if (role !== "USER" && role !== "ADMIN") {
      return res.status(400).json({
        error: "El rol debe ser 'USER' o 'ADMIN'"
      });
    }

    // Llamada a la capa de servicio
    const users = await getUsersByRoleService(role);

    return res.status(200).json({
      message: `Usuarios con rol ${role} obtenidos con Prisma`,
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}
// Funcion para buscar un usuario por email usando Prisma
export async function getUserByEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.params;

    // Validación de entrada (responsabilidad del controlador)
    if (!email || typeof email !== "string") {
      return res.status(400).json({
        error: "El email es obligatorio y debe ser una cadena de texto"
      });
    }

    // Llamada a la capa de servicio
    const user = await getUserByEmailService(email);

    return res.status(200).json({
      message: `Usuario con email ${email} obtenido con Prisma`,
      data: user
    });
  } catch (error) {
    next(error);
  }
}
// Función para identificar un usuario por ID usando Prisma
export async function getUserByIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("El ID debe ser un número", 400, {
        received: req.params.id
      });
    }

    const user = await getUserByIdService(id);

    return res.status(200).json({
      message: "Usuario encontrado con Prisma",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

// Endpoint para crear un usuario de prueba usando Prisma
export async function createDebugUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const createdUser = await createDebugUserService(req.body);

    return res.status(201).json({
      message: "Usuario creado con Prisma",
      data: createdUser
    });
  } catch (error) {
    next(error);
  }
}