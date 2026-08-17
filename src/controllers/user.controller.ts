// Los controladores de usuario manejan las solicitudes HTTP y delegan la lógica de negocio a los servicios.
import { Request, Response, NextFunction } from "express";
import {
  createDebugUserService,
  getActiveUsersService,
  getInactiveUsersService,
  getUserByIdService,
  getUserByEmailService,
  getUsersService,
  getUsersCountService,
  getUsersByRoleService
} from "../services/user.service";
import { AppError } from "../errors/AppError";

// Función de listado de usuarios 
export async function getUsersController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getUsersService(); // Llamamos al servicio para obtener todos los usuarios de forma segura

    return res.status(200).json({
      message: "Usuarios obtenidos",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener todos los usuarios activos 
export async function getActiveUsersController( // Es async porque asi podemos usar await dentro de la funcion para esperar a que la promesa de prisma.user.findMany se resuelva antes de continuar con la ejecución del código.
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getActiveUsersService();

    return res.status(200).json({
      message: "Usuarios activos obtenidos",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener todos los usuarios inactivos
export async function getInactiveUsersController( 
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await getInactiveUsersService();

    return res.status(200).json({
      message: "Usuarios Inactivos obtenidos",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener el conteo total de usuarios
export async function getUsersCountController(
  req: Request,
  res: Response,
  next: NextFunction
) {try {
    const total = await getUsersCountService();
    return res.status(200).json({
      message: "Conteo de usuarios",
      total
    });
  } catch (error) {
    next(error);
  }
}
// Función para obtener un usuario filtrado por ROl 
export async function getUsersByRoleController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
    const role = String(req.params.role);
    
    const { usersByRole, cleanRole } = await getUsersByRoleService(role);

    return res.status(200).json({
      message: `Listado de usuarios con rol '${cleanRole}'`,
      total: usersByRole.length,
      data: usersByRole
    })

  } catch (error) {
    next(error);
  }
}

// Funcion para buscar un usuario por email  
export async function getUserByEmailController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = String(req.params.email);
    const data = await getUserByEmailService(email);

    res.status(200).json({
      message: "Búsqueda de usuario por email",
      data: data
    });
  } catch (error) {
    next(error);
  }
}
// Función para identificar un usuario por ID  
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
      message: "Usuario encontrado",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

// Endpoint para crear un usuario de prueba  
export async function createDebugUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const createdUser = await createDebugUserService(req.body);

    return res.status(201).json({
      message: "Usuario creado",
      data: createdUser
    });
  } catch (error) {
    next(error);
  }
}