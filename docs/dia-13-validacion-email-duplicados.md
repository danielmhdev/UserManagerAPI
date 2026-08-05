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

## 409 Conflict

### ¿Qué significa 409 Conflict?
El código de estado HTTP **409 Conflict** indica que la petición enviada por el cliente no se ha podido procesar porque **entra en conflicto directo con el estado actual del servidor o del recurso**. 

No se trata de un fallo en la sintaxis de la petición, sino de una incompatibilidad con los datos que ya existen guardados en el sistema.

### ¿Por qué lo usamos cuando el email ya está registrado?
En nuestra API, la propiedad `email` actúa como un identificador único por cada usuario. Cuando un cliente intenta registrar un nuevo usuario (`POST`) o actualizar uno existente (`PATCH`) utilizando un correo que ya pertenece a otra persona en el array `users`, se genera un **conflicto de duplicidad**. 

Responder con un `409 Conflict` comunica de forma explícita que la operación violaría la regla de unicidad de los correos electrónicos en el sistema.

### ¿Por qué no sería tan adecuado usar 400 para este caso?
* **El código `400 Bad Request`** indica que la petición está mal construida a nivel sintáctico o de formato (por ejemplo, si no se envía el parámetro, si falta la `@`, o si el tipo de dato es un número en lugar de un texto).
* **El código `409 Conflict`**, en cambio, se utiliza cuando la petición está **bien formada y cumple todas las reglas sintácticas**, pero el servidor rechaza la operación por el estado interno de sus datos.

Usar `409` en lugar de `400` proporciona mucha más semántica a la API. De este modo, el cliente o el frontend pueden identificar exactamente que el fallo se debe a un duplicado y mostrar un mensaje específico al usuario (como *"Este correo ya está en uso, prueba a iniciar sesión"*), en lugar de tratarlo como un error genérico de entrada de datos.

## Normalización de datos

### ¿Qué significa normalizar un email?
Normalizar un email consiste en **transformar la cadena de texto a un formato estándar y consistente** antes de procesarla, compararla o almacenarla en el sistema. 

En nuestra API, la función `normalizeEmail()` aplica dos transformaciones fundamentales a la entrada del usuario:
1. **Limpieza de espacios (`.trim()`):** Elimina los espacios en blanco accidentales al inicio y al final del texto.
2. **Conversión a minúsculas (`.toLowerCase()`):** Convierte todos los caracteres alfabéticos a minúsculas, ya que los servidores de correo no hacen distinción entre mayúsculas y minúsculas en las direcciones.

### ¿Qué problemas evita?
Aplicar normalización antes de guardar o buscar en la base de datos resuelve problemas críticos de consistencia:

* **Evita duplicados falsos:** Impide que un mismo usuario cree múltiples cuentas utilizando variaciones de mayúsculas o espacios accidentales.
* **Garantiza búsquedas y autenticaciones exitosas:** Asegura que el usuario pueda iniciar sesión o ser buscado independientemente de cómo escriba su correo en el formulario (por ejemplo, con la primera letra en mayúscula por el autocorrector del móvil).
* **Consistencia en la base de datos:** Mantiene un registro limpio y uniforme de todos los datos en el sistema.

### ¿Qué pasaría si guardásemos los emails tal como llegan?
Si la API almacenara los correos exactamente como los envía el cliente, el sistema trataría las siguientes tres entradas como si fueran **tres usuarios completamente distintos**:

1. `"ANA@EMAIL.COM"`
2. `"ana@email.com"`
3. `"  ana@email.com "`

**Consecuencias directas:**

* **Fallo en la detección de duplicados:** Al hacer la comprobación `user.email === cleanEmail`, JavaScript determinaría que `"ANA@EMAIL.COM" === "ana@email.com"` es `false`. El servidor permitiría registrar a dos personas con el mismo correo real.
* **Bloqueos al iniciar sesión:** Si un usuario se registra como `"ANA@EMAIL.COM"` e intenta entrar más tarde escribiendo `"ana@email.com"`, el sistema respondería con un error `404 (Usuario no encontrado)`, causando una pésima experiencia de usuario.
* **Datos corruptos:** Tendríamos registros con espacios invisibles guardados que romperían integraciones futuras con servicios de envío de correos o sistemas de autenticación.