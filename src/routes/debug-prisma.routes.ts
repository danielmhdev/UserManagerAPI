import { Router } from "express";
import { prisma } from "../prisma"; // Importamos la instancia de Prisma desde el archivo prisma.ts

export const debugPrismaRouter = Router();

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true
} as const;
// Endpoint para obtener todos los usuarios usando Prisma
debugPrismaRouter.get("/users", async (req, res, next) => {
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
// Rutas de depuración para Prisma
debugPrismaRouter.get("/users-active", async (req, res, next) => {
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

// Endpoint de conteo total de usuarios usando Prisma
debugPrismaRouter.get("/users-count", async (req, res, next) => {
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
debugPrismaRouter.get("/users-role/:role", async (req, res, next) => {
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

// Endpoint para obtener un usuario por id usando Prisma
debugPrismaRouter.get("/users/:id", async (req, res, next) => {
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
})

// Endpoint para crear un nuevo usuario usando Prisma
debugPrismaRouter.post("/users", async (req, res, next) => {
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
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "El email ya está registrado"
      });
    }

    next(error);
  }
});