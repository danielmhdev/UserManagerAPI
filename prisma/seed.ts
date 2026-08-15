import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@email.com"
    },
    update: {},
    create: {
      name: "Admin Principal",
      email: "admin@email.com",
      passwordHash: "hash_temporal_admin123",
      role: Role.ADMIN,
      isActive: true
    }
  });

  const user = await prisma.user.upsert({
    where: {
      email: "user@email.com"
    },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "user@email.com",
      passwordHash: "hash_temporal_user123",
      role: Role.USER,
      isActive: true
    }
  });

  const inactiveUser = await prisma.user.upsert({
    where: {
      email: "inactive@email.com"
    },
    update: {},
    create: {
      name: "Usuario Inactivo",
      email: "inactive@email.com",
      passwordHash: "hash_temporal_inactive123",
      role: Role.USER,
      isActive: false
    }
  });

  const editorDemo = await prisma.user.upsert({
    where: {
      email: "editor@email.com"
    },
    update: {},
    create: {
      name: "Editor Demo",
      email: "editor@email.com",
      passwordHash: "hash_temporal_editor123",
      role: Role.USER,
      isActive: true
    }
  });

  console.log("Seed ejecutado correctamente:");
  console.log({ admin, user, inactiveUser });
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