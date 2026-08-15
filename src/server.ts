// Preparación Proyecto y configuración

import express, {Request, Response, NextFunction} from "express";
import { prisma } from "./prisma"; // Importamos la instancia de Prisma desde el archivo prisma.ts

const app = express(); // Creamos una instancia de la aplicación Express
const PORT = process.env.PORT ||3000; // Definimos el puerto en el que escuchará el servidor
app.use(express.json()); //Permite leer JSON en las solicitudes entrantes(POST,PUT...)

// ==========================================
// ENDPOINTS DE PRUEBA CON PRISMA
// ==========================================
const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} as const;
// Función para verificar si un error es un error de restricción de unicidad de Prisma (código P2002)
function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
// Endpoint para obtener todos los usuarios usando Prisma
app.get("/api/debug/prisma/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: userSafeSelect,
      orderBy: {
        id: "asc"
      }
    });

    return res.status(200).json({
      message: "Usuarios obtenidos con Prisma",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
});
// Endpoint para obtener usuarios activos usando Prisma
app.get("/api/debug/prisma/users-active", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true
      },
      select: userSafeSelect,
      orderBy: {
        id: "asc"
      }
    });

    return res.status(200).json({
      message: "Usuarios activos obtenidos con Prisma",
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
});
// Endpoint para obtener un usuario por id usando Prisma
app.get("/api/debug/prisma/users/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un número"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: userSafeSelect
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      });
    }

    return res.status(200).json({
      message: "Usuario encontrado con Prisma",
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint de conteo total de usuarios usando Prisma
app.get("/api/debug/prisma/users-count", async (req, res, next) => {
  try {
    const total = await prisma.user.count();
    return res.status(200).json({
      message: "Conteo de usuarios obtenido con Prisma",
      total
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para añidir filtro por rol
app.get("/api/debug/prisma/users-role/:role", async (req, res, next) => {
  try {
    const { role } = req.params;
    if (role !== "USER" && role !== "ADMIN") {  
      return res.status(400).json({
        error: "El rol debe ser 'USER' o 'ADMIN'"
      });
    }

    const users = await prisma.user.findMany({
      where: {
        role
      },
      select: userSafeSelect,
      orderBy: {
        id: "asc"
      }
    });

    return res.status(200).json({
      message: `Usuarios con rol ${role} obtenidos con Prisma`,
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint para crear un nuevo usuario usando Prisma
app.post("/api/debug/prisma/users", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email y password son obligatorios"
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    if (cleanName.length === 0) {
      return res.status(400).json({
        error: "El nombre no puede estar vacío"
      });
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return res.status(400).json({
        error: "El email no tiene un formato válido"
      });
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres"
      });
    }

    const createdUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash: `hash_temporal_${cleanPassword}`
      },
      select: userSafeSelect
    });

    return res.status(201).json({
      message: "Usuario creado con Prisma",
      data: createdUser
    });
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return res.status(409).json({
        error: "El email ya está registrado"
      });
    }

    next(error);
  }
});
// ====================================
// BASE DE DATOS SIMULADA (En memoria)
// ====================================
type User = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
// Datos temporales en memoria. Más adelante se sustituirán por una base de datos.
const users: User[] = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@email.com",
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Laura Martínez",
    email: "laura@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Daniel Martínez",
    email: "daniel@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Juan Gómez",
    email: "juan@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Jordi Cido",
    email: "jordi@email.com",
    role: "USER",
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
// ==========================================
// CLASE AppError para manejar errores de manera consistente
// ==========================================
// Creamos la clase AppError para manejar los errores

class AppError extends Error {
  statusCode: number;
  details?: unknown; // Propiedad opcional

  constructor(message: string, statusCode: number = 500, details?: unknown){
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ==========================================
// Funciones auxiliares 
// ==========================================
// Valida que un valor sea un string no vacío.
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

// Valida que un valor sea booleano.
function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

// Valida que un email tenga un formato básico válido.
function isValidBasicEmail(value: string): boolean {
  return (
    value.includes("@") &&
    value.includes(".") &&
    !value.startsWith("@") &&
    !value.endsWith("@")
  );
}
// Normaliza un email eliminando espacios y convirtiéndolo a minúsculas.
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Valida si un email ya está registrado en el array de usuarios, ignorando un id específico si se proporciona.
function isEmailTaken(email: string, userIdToIgnore?: number): boolean {
  const normalizedEmail = normalizeEmail(email);

  return users.some(
    (user) => user.email === normalizedEmail && user.id !== userIdToIgnore,
  );
}
// Valida que un nombre tenga al menos dos caracteres
function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}
// Valida que una contraseña tenga al menos 8 caracteres, incluyendo letras, números y caracteres especiales.
function isValidPassword(value: string): boolean {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return regex.test(value);
}
// ==========================================
// ENDPOINTS GENERALES Y DE INFORMACIÓN
// ==========================================
app.get("/", (req, res) => {
  res.json({
    name: "UserManager API",
    version: "1.0.0",
    status: "running",
    author: "Daniel M.H.",
  });
});

// Creamos un endpoint con GET para obtener información de la API
app.get("/api/info", (req, res) => {
  res.json({
    project: "UserManager API",
    description: "API REST para gestionar usuarios",
    day: 2,
    technologies: ["Node.js", "Express", "TypeScript"],
  });
});

// Creamos un endpoint con GET para verificar el estado de la API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "200 OK",
    message: "UserManager API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: "development",
  });
});

// Creamos un endpoint con GET para verificar la latencia de la API
app.get("/api/ping", (req, res) => {
  res.json({
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// ENDPOINTS DE USUARIOS (CRUD CON ARRAY)
// ==========================================
// NOTA: Se eliminaron los endpoints "simulados" del día 4 y se reemplazaron por los funcionales de los días 7, 8,9 10 y 11.
// Creamos un endpoint con GET para obtener todos los usuarios con el nuevo array
app.get("/api/users", (req, res) => {
  res.status(200).json({
    message: "Listado de Usuarios",
    total: users.length,
    data: users,
  });
});

// Conteo total de usuarios
app.get("/api/users/count", (req, res) => {
  const totalUsers = users.length;
  res.status(200).json({
    total: totalUsers,
  });
});

// Creamos un endpoint para consultar usuarios activos
app.get("/api/users/active", (req, res) => {
  const activeUsers = users.filter((user) => user.isActive);
  res.status(200).json({
    activeUsers,
  });
});

// Creamos un endpoint de usuarios inactivos
app.get("/api/users/inactive", (req, res) => {
  const inactiveUsers = users.filter((user) => !user.isActive);

  return res.status(200).json({
    message: "Lista de usuarios inactivos",
    inactiveUsers,
  });
});

// Creamos un endpoint para probar una busqueda simulada
app.get("/api/users/search", (req, res) => {
  const { name, role } = req.query;
  res.status(200).json({
    message: "Búsqueda de usuarios",
    filters: { name, role },
  });
});

// Creamos un endpoint para probar una busqueda simulada por email
app.get("/api/users/search/email", (req, res) => {
  const { email } = req.query;
  // Validamos que el email sea un string no vacío y tenga un formato válido
  if (!isNonEmptyString(email)) {
    return res.status(400).json({
      error: "El email debe ser un texto no vacío",
      receivedEmail: email,
    });
  }
  // Normalizamos el email para evitar problemas de mayúsculas y espacios
  const cleanEmail = normalizeEmail(email);

  if (!isValidBasicEmail(cleanEmail)) {
    return res.status(400).json({
      error: "El email no tiene un formato válido",
      receivedEmail: email,
    });
  }
  // Bucamos en el array
  const user = users.find((user) => user.email === cleanEmail);
  // Si no encontramos el usuario, devolvemos un error 404
  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      email: cleanEmail,
    });
  }

  res.status(200).json({
    message: "Usuario encontrado",
    data: user,
  });
});

// Creamos un enpoint con GET para consultar nuestro perfil
app.get("/api/users/me", (req, res) => {
  res.status(200).json({
    id: 4, // Actualizado para que coincida con el ID de Daniel en el array
    name: "Daniel M.H",
    email: "daniel@email.com",
    role: "USER",
    isActive: true,
  });
});

// Creamos un endpoint con GET para obtener un usuario por id usando el array
app.get("/api/users/:id", (req, res, next) => {
  const idParam = req.params.id; // Obtenemos el id del usuario desde los parámetros de la solicitud
  const id = Number(req.params.id); //Convertimos el id a número para poder compararlo con los ids del array de usuarios

  if (Number.isNaN(id)) {
    // Si el id no es un número, devolvemos un error 400
    return next(
      new AppError("El ID debe ser un número", 400,{
        receivedId: idParam,
      })
    );
  }

  const user = users.find((user) => user.id === id); // Buscamos el usuario en el array por id

  if (!user) {
    // Si no encontramos el usuario, devolvemos un error 404
    return next(
      new AppError("Usuario no encontrado", 404, {
        id,
      })
    );
  }
  return res.status(200).json({
    // Si encontramos el usuario, devolvemos el usuario encontrado
    message: "Usuario encontrado",
    data: user,
  });
});

// Creamos un endpoint con POST para crear un nuevo usuario y añadirlo al array de usuarios
app.post("/api/users", (req, res, next) => {
  const { name, email, password } = req.body;

  if (!isNonEmptyString(name)) {
    return next(
      new AppError("El nombre debe ser un texto no vacio", 400,{
        receivedName: name
      })
    );
  }

  if (!isValidName(name)) {
    return next(
      new AppError("El nombre debe tener al menos dos caracteres", 400,{
        receivedName: name
      })
    );
  }

  if (!isNonEmptyString(email)) {
    return next(
      new AppError("El email debe ser un texto no vacío", 400,{
        receivedName: email
      })
    );
  }

  if (!isNonEmptyString(password)) {
    return next(
      new AppError("La contraseña debe ser un texto no vacio", 400,{
      })
    );
  }

  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = password.trim();

  if (!isValidPassword(cleanPassword)) {
    return next(
      new AppError("La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y caracteres especiales", 400,{
      })
    );
  }

  if (!isValidBasicEmail(cleanEmail)) {
    return next(
      new AppError("El email no tiene un formato valido", 400,{
        receivedName: email
      })
    );
  }
    

  if (isEmailTaken(cleanEmail)) {
    return res.status(409).json({
      error: "El email ya está registrado",
    });
  }

  const newId =
    users.length > 0 // Si el array de usuarios no está vacío, generamos un nuevo id sumando 1 al id más alto existente, si está vacío, el nuevo id será 1
      ? Math.max(...users.map((user) => user.id)) + 1
      : 1;

  const newUser: User = {
    // Creamos un nuevo usuario con los datos recibidos y el nuevo id generado
    id: newId,
    name: cleanName,
    email: cleanEmail,
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser); // Añadimos el nuevo usuario al array de usuarios

  return res.status(201).json({
    message: "Usuario creado correctamente",
    data: newUser,
  });
});

// Creamos una endpoint PATCH para actualizar un usuario existente del array
app.patch("/api/users/:id", (req, res, next) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return next(
      new AppError("El ID debe ser un número", 400,{
        receivedId: idParam,
      })
    );
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      id,
    });
  }

  // Impedir actualizar el rol a través de este endpoint
  if (req.body.role !== undefined) {
    return res.status(400).json({
      error: "No se puede modificar el rol desde esta ruta",
    });
  }
  // Impedir actualizar el id a través de este endpoint
  if (req.body.id !== undefined) {
    return res.status(400).json({
      error: "No se puede modificar el id desde un usuario",
    });
  }

  const { name, email, isActive } = req.body;

  const hasChanges =
    name !== undefined || email !== undefined || isActive !== undefined;

  if (!hasChanges) {
    return res.status(400).json({
      error:
        "Debes enviar al menos un campo para actualizar (name, email o isActive)",
    });
  }

  // Limpiar y validar el email si llega
  let cleanEmail: string | undefined;

  if (email !== undefined) {
    if (!isNonEmptyString(email)) {
      return res.status(400).json({
        error: "El email debe ser un texto no vacío",
      });
    }

    cleanEmail = normalizeEmail(email);

    if (!isValidBasicEmail(cleanEmail)) {
      return res.status(400).json({
        error: "El email no tiene un formato válido",
      });
    }

    if (isEmailTaken(cleanEmail, id)) {
      return res.status(409).json({
        error: "El email ya está registrado",
      });
    }
  }

  // Limpiar el nombre si llega
  let cleanName: string | undefined;

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      return res.status(400).json({
        error: "El nombre debe ser un texto no vacío",
      });
    }

    if (!isValidName(name)) {
      return res.status(400).json({
        error: "El nombre debe tener al menos dos caracteres",
      });
    }

    cleanName = name.trim();
  }

  // Validamos isActive si llega
  if (isActive !== undefined && !isBoolean(isActive)) {
    return res.status(400).json({
      error: "isActive debe ser true o false",
    });
  }

  // Actualizamos los campos del usuario en el array
  const currentUser = users[userIndex];

  const updatedUser: User = {
    ...currentUser,
    name: cleanName ?? currentUser.name,
    email: cleanEmail ?? currentUser.email,
    isActive: isActive ?? currentUser.isActive,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;

  return res.status(200).json({
    message: "Usuario actualizado correctamente",
    data: updatedUser,
  });
});

// Creamos un endpoint para cambiar estado
app.patch("/api/users/:id/status", (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);
  const { isActive } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número",
      received: idParam,
    });
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      id,
    });
  }

  if (isActive === undefined || typeof isActive !== "boolean") {
    return res.status(400).json({
      error: "isActive debe ser true o false",
    });
  }

  const currentUser = users[userIndex];

  const updatedUser: User = {
    ...currentUser,
    isActive: isActive ?? currentUser.isActive,
    updatedAt: new Date().toISOString(),
  };
  users[userIndex] = updatedUser;

  res.status(200).json({
    message: "Estado de usuario actualizado",
    data: updatedUser,
  });
});

// Creamos un endpoint para cambiar rol
app.patch("/api/users/:id/role", (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  res.status(200).json({
    message: "Rol de usuario recibido para actualizar",
    id: id,
    role: role,
  });
});

// Creamos un endpoint de cambio de contraseña para un usuario
app.patch("/api/users/me/password", (req, res) => {
  const { currentPassword, newPassword } = req.body;

  res.status(200).json({
    message: "Solicitud de cambio de contraseña recibida",
  });
});

// Creamos un endpoint DELETE para eliminar un usuario existente
app.delete("/api/users/:id", (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número",
      received: idParam,
    });
  }
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      id,
    });
  }
  const currentUser = users[userIndex];

  if (!currentUser.isActive) {
    return res.status(200).json({
      message: "El usuario ya está desactivado",
      data: {
        id: currentUser.id,
        name: currentUser.name,
        isActive: currentUser.isActive,
      },
    });
  }

  const updatedUser: User = {
    ...currentUser,
    isActive: false,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;

  return res.status(200).json({
    message: "Usuario desactivado correctamente",
    data: updatedUser,
  });
});

// Creamos un endpoint para reactivar un usuario desactivado
app.patch("/api/users/:id/reactivate", (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: "El ID debe ser un número",
      received: idParam,
    });
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: "Usuario no encontrado",
      id,
    });
  }

  const currentUser = users[userIndex];

  if (currentUser.isActive) {
    return res.status(200).json({
      message: "El usuario ya está activo",
      data: {
        id: currentUser.id,
        name: currentUser.name,
        isActive: currentUser.isActive,
      },
    });
  }

  const updatedUser: User = {
    ...currentUser,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;

  return res.status(200).json({
    message: "Usuario reactivado correctamente",
    data: updatedUser,
  });
});

// ==========================================
// ENDPOINTS DE DEPURACIÓN Y PRUEBAS (DEBUG)
// ==========================================

// Creamos un endpoint para probar errores internos con appError
app.get("/api/debug/error", (req, res, next) => {
  next(new AppError("Error de prueba interno", 500));
});

//Creamos un endpoint para probar body
app.post("/api/debug/body", (req, res) => {
  res.status(200).json({
    message: "Datos recibidos correctamente",
    body: req.body, // Más corto y concsiso que userData = req.body para devolver los datos recibidos en el cuerpo de la solicitud,
    // se usa para debuggear y ver que datos se reciben en el body de la solicitud.
  });
});

// Creamos un endopoint para probar params
// Por ejemplo: http://localhost:3000/api/debug/params/1 nos devolverá un objeto con el id recibido en los params.
app.get("/api/debug/params/:id", (req, res) => {
  res.status(200).json({
    message: "Parámetros recibidos correctamente",
    params: req.params,
  });
});

// Creamos un endpoint para probar query params
// Por ejemplo: http://localhost:3000/api/debug/query?role=ADMIN&isActive=true nos devolverá un objeto con los query params recibidos.
app.get("/api/debug/query", (req, res) => {
  res.status(200).json({
    message: "Query params recibidos correctamente",
    query: req.query,
  });
});

// Creamos un endpoint para probar headers
// Por ejemplo: http://localhost:3000/api/debug/headers nos devolverá un objeto con los headers recibidos.
app.get("/api/debug/headers", (req, res) => {
  res.status(200).json({
    message: "Headers recibidos correctamente",
    headers: req.headers,
  });
});

// Creamos un endopoint combinando params, query y headers
// Por ejemplo: http://localhost:3000/api/debug/users/7?notify=true
app.patch("/api/debug/users/:id", (req, res) => {
  const { id } = req.params;
  const { notify } = req.query;
  const authorization = req.headers.authorization;
  const changes = req.body;

  res.status(200).json({
    message: "Datos combinados recibidos",
    id,
    notify,
    authorization,
    changes,
  });
});

// Creamos un enpoint con un header personalizado
app.get("/api/debug/client", (req, res) => {
  const clientName = req.headers["x-client-name"];

  res.status(200).json({
    message: "Header personalizado recibido",
    clientName: clientName,
  });
});

// Creamos un endopoint para depuracion
app.post("/api/debug/request", (req, res) => {
  res.status(200).json({
    message: "Información completa de la petición",
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    headers: req.headers,
    body: req.body,
  });
});

// Creamos un endpoint con header personalizado
app.post("/api/debug/request/headers", (req, res) => {
  const { message } = req.body;
  const nombreEstudiante = req.headers["x-student-name"];
  res.status(200).json({
    message,
    nombreEstudiante,
  });
});


// ==========================================
// Middlewares
// ==========================================
// De rutas no encontradas (404)
function notFoundMiddleware(req: Request, res: Response, next: NextFunction){
  next(
    new AppError ("No existe la ruta " + req.originalUrl, 404,));
}
// Global de errores

function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const details = isAppError ? err.details : undefined;

  return res.status(statusCode).json({
    error: isAppError ? err.message : "Error interno del servidor",
    statusCode,
    details,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

// ==========================================
//Arrancamos el servidor escuchando en el puerto definido, y añadimos los middlewares de error y ruta no encontrada
// ==========================================
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
