# Día 12 - Validación manual básica

## Qué he hecho

- He revisado las validaciones existentes.
- He creado funciones auxiliares de validación.
- He validado strings no vacíos.
- He validado tipos de datos.
- He limpiado `name` y `email` con `trim`.
- He normalizado `email` a minúsculas.
- He mejorado la validación de creación de usuarios.
- He mejorado la validación de actualización de usuarios.
- He probado errores `400 Bad Request`.

## Funciones creadas

```ts
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isValidBasicEmail(value: string): boolean {
  return value.includes("@") && value.includes(".");
}

function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}
```

## Casos probados

| Caso                            | Código esperado | Resultado                                                                                                                                                 |
| ------------------------------- | --------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nombre vacío                    |             400 | Bad Request — `{"error": "El nombre debe ser un texto no vacío"}` (al enviar `""` la longitud tras el `.trim()` es 0).                                    |
| Nombre con solo espacios        |             400 | Bad Request — `{"error": "El nombre debe ser un texto no vacío"}` (al enviar `"   "`, `isNonEmptyString` devuelve `false`).                               |
| Email no string                 |             400 | Bad Request — `{"error": "El email debe ser un texto no vacío"}` (al enviar un número, booleano o `null`, falla la comprobación `typeof`).                |
| Password no string              |             400 | Bad Request — `{"error": "La contraseña debe ser un texto no vacío"}` (falla la comprobación de tipo de dato).                                            |
| Email con mayúsculas y espacios |             201 | Created — Devuelve `201 Created` guardando el email correctamente normalizado en minúsculas y sin espacios laterales (gracias a `.trim().toLowerCase()`). |
| `isActive` incorrecto en PATCH  |             400 | Bad Request — `{"error": "isActive debe ser true o false"}` (al no cumplir la validación `isBoolean(isActive)`).                                          |

## Explicación personal

Validar datos significa comprobar que lo que llega a la API tiene el formato
esperado antes de usarlo. Si los datos son incorrectos, la API debe responder
con un error claro y no continuar con la operación.

## Errores de validación

| Error                   | Cuándo ocurre                                                                                                                                                                                                 |          Código |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------: |
| **Nombre vacío**        | Ocurre cuando el campo `name` se omite, no es de tipo `string`, se envía como una cadena vacía (`""`) o contiene únicamente espacios en blanco (`"   "`).                                                     | 400 Bad Request |
| **Email no válido**     | Ocurre cuando el campo `email` se omite, no es de tipo `string`, está vacío tras eliminar espacios o no contiene el carácter `@` para formar una estructura válida.                                           | 400 Bad Request |
| **Password corta**      | Ocurre cuando el campo `password` es de tipo `string` pero su longitud tras limpiar espacios laterales (`.trim()`) es inferior a 6 caracteres.                                                                | 400 Bad Request |
| **isActive incorrecto** | Ocurre cuando se envía el campo `isActive` con un tipo de dato diferente a `boolean` (por ejemplo, como texto `"true"`, número `1` u objeto), o cuando se omite en un endpoint donde su envío es obligatorio. | 400 Bad Request |

## ¿Por qué no debemos confiar en el cliente?

Aunque desarrollemos un frontend impecable con formularios llenos de validaciones visuales, la API nunca debe confiar a ciegas en los datos que recibe. El frontend se encarga de mejorar la experiencia del usuario, pero la API es la **última barrera de defensa** antes de guardar o modificar la información en la base de datos.

Las razones principales para implementar siempre validaciones en el backend son:

1. **El cliente es manipulable:** Cualquier persona con conocimientos básicos puede abrir las herramientas de desarrollador del navegador (F12), saltarse las validaciones de HTML/JavaScript del cliente o modificar los scripts que se ejecutan en su equipo.
2. **Peticiones directas sin interfaz:** Un usuario o cliente malintencionado no necesita usar nuestro frontend para interactuar con la API. Puede enviar peticiones `POST` o `PATCH` directamente mediante herramientas como Postman, cURL o scripts automatizados, esquivando por completo las restricciones de la pantalla.
3. **Múltiples clientes consumiendo la API:** Una misma API REST puede ser consumida por una aplicación web, una app móvil (iOS/Android) o servicios de terceros. Centralizar las reglas de negocio y validaciones en el backend garantiza que los datos siempre sean correctos, sin importar de qué cliente provengan.
4. **Protección de la integridad de los datos:** Si permitimos que entren datos corruptos, incompletos o maliciosos (como un `name` vacío, un `email` sin formato o tipos de datos erróneos), pondremos en riesgo la estabilidad del servidor, corromperemos la base de datos y generaremos fallos en cascada en toda la aplicación.
