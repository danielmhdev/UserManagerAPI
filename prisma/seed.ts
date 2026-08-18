import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 10;
// Estos passwords son solo para entorno de desarrollo.
// En producción no se deberían usar credenciales predecibles.
async function main() {
  const adminPasswordHash = await bcrypt.hash("admin123", SALT_ROUNDS);
  const userPasswordHash = await bcrypt.hash("user123", SALT_ROUNDS);
  const inactivePasswordHash = await bcrypt.hash("inactive123", SALT_ROUNDS);
  const editorPasswordHash = await bcrypt.hash("editor123", SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@email.com",
    },
    update: {
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Admin Principal",
      email: "admin@email.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: "user@email.com",
    },
    update: {
      passwordHash: userPasswordHash,
    },
    create: {
      name: "Usuario Demo",
      email: "user@email.com",
      passwordHash: userPasswordHash,
      role: Role.USER,
      isActive: true,
    },
  });

  const inactiveUser = await prisma.user.upsert({
    where: {
      email: "inactive@email.com",
    },
    update: {
      passwordHash: inactivePasswordHash,
    },
    create: {
      name: "Usuario Inactivo",
      email: "inactive@email.com",
      passwordHash: inactivePasswordHash,
      role: Role.USER,
      isActive: false,
    },
  });

  const editorDemo = await prisma.user.upsert({
    where: {
      email: "editor@email.com",
    },
    update: {
      passwordHash: editorPasswordHash,
    },
    create: {
      name: "Editor Demo",
      email: "editor@email.com",
      passwordHash: editorPasswordHash,
      role: Role.USER,
      isActive: true,
    },
  });

  console.log("Seed ejecutado correctamente:");
  console.log({ admin, user, inactiveUser, editorDemo });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error ejecutando el seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
