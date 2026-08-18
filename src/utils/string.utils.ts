//Funciones auxiliares para validar y normalizar datos de usuario

// Valida que un valor sea un string no vacío.
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
// Normaliza un email eliminando espacios y convirtiéndolo a minúsculas.

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Valida que un email tenga un formato básico válido.
export function isValidBasicEmail(email: string): boolean {
  return (
    email.includes("@") &&
    email.includes(".") &&
    !email.startsWith("@") &&
    !email.endsWith("@")
  );
}

// Valida que un nombre tenga al menos dos caracteres
export function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}
// Valida que una contraseña tenga al menos 8 caracteres, incluyendo letras, números y caracteres especiales.
export function isValidPassword(value: string): boolean {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return regex.test(value);
}
