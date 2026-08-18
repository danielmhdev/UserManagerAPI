import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Número de rondas de sal para el hashing de contraseñas

// Función para hashear una contraseña utilizando bcrypt
export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Función para comparar una contraseña con su hash utilizando bcrypt
export async function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}
