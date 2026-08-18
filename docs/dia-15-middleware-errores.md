# Día 15 - Middleware centralizado de errores

## Qué he hecho

- He aprendido qué es un middleware.
- He aprendido para qué sirve `next()`.
- He creado una clase `AppError`.
- He creado un middleware para rutas no encontradas.
- He creado un middleware global de errores.
- He adaptado `GET /api/users/:id` para usar `next(new AppError(...))`.
- He probado errores `400`, `404` y `500`.
- He comprobado que los errores tienen un formato común.

## Clase AppError

```ts
class AppError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
```

## Formato de error

```json
{
  "error": "Mensaje del error",
  "statusCode": 400,
  "details": {},
  "path": "/api/users/abc",
  "method": "GET",
  "timestamp": "..."
}
```

## Casos probados

| Petición                  | Caso                    | Código esperado | Resultado                                                                                    |
| ------------------------- | ----------------------- | --------------: | -------------------------------------------------------------------------------------------- |
| `GET /api/users/1`        | Usuario existente       |             200 | Devuelve el objeto del usuario encontrado con `statusCode: 200`.                             |
| `GET /api/users/abc`      | ID no válido            |             400 | `AppError` captura el ID inválido y devuelve `statusCode: 400` ("El ID debe ser un número"). |
| `GET /api/users/999`      | Usuario no encontrado   |             404 | `AppError` no localiza el ID y devuelve `statusCode: 404` ("Usuario no encontrado").         |
| `GET /api/ruta-inventada` | Ruta inexistente        |             404 | Capturado por `notFoundMiddleware`, genera un error 404 indicando la ruta no encontrada.     |
| `GET /api/debug/error`    | Error interno de prueba |             500 | `errorMiddleware` responde con `statusCode: 500` mediante el fallback de seguridad.          |

## Explicación personal

Un middleware de errores permite centralizar la forma en que la API responde
cuando ocurre un problema. Así evitamos que cada ruta devuelva errores con
formatos diferentes.

## Orden de middlewares

En Express, **el orden en el que se declaran los middlewares determina el flujo de ejecución de la aplicación**. Express procesa las peticiones de arriba a abajo (_top-to-bottom_), exactamente igual que una cadena de montaje o una serie de peajes secuenciales.

---

### 1. ¿Por qué el middleware 404 debe ir después de las rutas?

El middleware 404 actúa como una **red de seguridad para rutas inexistentes**. Su trabajo es capturar cualquier petición que no haya coincidido con ninguno de los endpoints definidos en la API.

- **Si lo ponemos al final (correcto):** Cuando llega una petición (ej: `GET /api/users`), Express la compara con el primer endpoint, luego con el segundo, y así sucesivamente. Si encuentra la coincidencia, responde y finaliza el ciclo. Si revisa todas las rutas y **ninguna coincide**, la petición cae de forma natural en el middleware 404.
- **Si lo pusiéramos antes de las rutas (incorrecto):** Express ejecutaría el middleware 404 inmediatamente al recibir la petición, interrumpiendo el flujo antes de que tuviera la oportunidad de evaluar si la ruta buscada existía más abajo. El cliente siempre recibiría un error 404, incluso pidiendo una ruta válida como `/api/health`.

---

### 2. ¿Por qué el middleware de errores debe ir al FINAL absoluto?

En Express, los middlewares de manejo de errores (los que reciben 4 parámetros: `err, req, res, next`) solo se activan cuando una ruta o middleware anterior lanza un error explícito mediante `throw new AppError(...)` o `next(err)`.

- **Si lo ponemos al final (correcto):** Cualquier error que ocurra dentro de los endpoints (`GET`, `POST`, `PATCH`, etc.) o en el middleware 404 "saltará" hacia adelante en la cadena hasta encontrar el primer controlador de errores disponible. Al estar al final del archivo `app.ts`, garantiza que capturará las excepciones de **toda** la aplicación.
- **Si lo pusiéramos antes de las rutas (incorrecto):** Los errores ocurridos en las rutas definidas por debajo de él jamás serían capturados por este middleware, provocando respuestas no controladas del servidor o bloqueos en la aplicación.
