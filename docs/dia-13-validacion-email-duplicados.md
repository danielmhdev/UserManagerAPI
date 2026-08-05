# Día 13 - Validación de email y control de duplicados

## Qué he hecho

- He creado una función para normalizar emails.
- He creado una función para validar emails de forma básica.
- He creado una función para comprobar si un email ya está registrado.
- He mejorado la creación de usuarios.
- He mejorado la actualización de usuarios.
- He comprobado duplicados en `POST /api/users`.
- He comprobado duplicados en `PATCH /api/users/:id`.
- He probado errores `400` y `409`.

## Funciones creadas

```ts
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidBasicEmail(value: string): boolean {
  return value.includes("@") && value.includes(".") && !value.startsWith("@")&& !value.endsWith("@");
}

function isEmailTaken(email: string, userIdToIgnore?: number): boolean {
  const normalizedEmail = normalizeEmail(email);

  return users.some(
    (user) => user.email === normalizedEmail && user.id !== userIdToIgnore
  );
}
```

## Casos probados

| Caso | Código esperado | Resultado |
| --- | ---: | --- |
| Crear usuario con email normalizado | 201 | Created — Devuelve el nuevo usuario guardando el correo sin espacios laterales y transformado a minúsculas mediante `normalizeEmail()`. |
| Crear usuario con email duplicado | 409 | Conflict — `{"error": "El email ya está registrado"}` (al detectar coincidencia exacta con `isEmailTaken()`). |
| Crear usuario con email sin @ | 400 | Bad Request — `{"error": "El email no tiene un formato válido"}` (falla la comprobación `isValidBasicEmail()` al no incluir `@`). |
| Crear usuario con email sin punto | 400 | Bad Request — `{"error": "El email no tiene un formato válido"}` (falla la comprobación `isValidBasicEmail()` al no incluir `.`). |
| Actualizar usuario con su mismo email | 200 | OK — Permite actualizar otros datos manteniendo su propio email, ya que `isEmailTaken(cleanEmail, id)` ignora el ID del usuario en edición. |
| Actualizar usuario con email de otro usuario | 409 | Conflict — `{"error": "El email ya está registrado"}` (bloquea la edición si el correo pertenece a un ID diferente). |
## Explicación personal

Normalizar un email significa limpiarlo antes de guardarlo o compararlo. En este
proyecto usamos `trim` y `toLowerCase` para evitar duplicados provocados por
espacios o mayúsculas.