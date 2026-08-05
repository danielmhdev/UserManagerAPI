# UserManager API

Reto opcional de construcción de una API REST de gestión de usuarios.

## Descripción

Este proyecto tiene como objetivo construir paso a paso una API REST capaz de
gestionar usuarios, autenticación, roles, seguridad, base de datos e integración
con un frontend.

## Instalación

1. **Instalar dependencias:**

```bash
npm install
```

2. **Arrancar en modo desarrollo:**

```bash
npm run dev
```

La API se ejecutará inicialmente en:

```text
http://localhost:3000
```

## Endpoints disponibles

**1. Estado y Comprobación**

`GET /api/health` — Comprueba el estado general del servidor.

`GET /api/ping` — Endpoint simple de respuesta rápida (`pong`).

**2. Endpoints de Usuarios (En Memoria)**

`GET /api/users` — Devuelve el listado completo de usuarios cargados en memoria.

`GET /api/users/:id` — Devuelve un usuario concreto a partir de su ID (maneja errores 400 si el ID no es válido y 404 si no existe).

`POST /api/users` — Simulación para la creación de usuarios.

`PATCH /api/users/:id `— Simulación para la actualización parcial de un usuario.

`DELETE /api/users/:id` — Simulación para la eliminación de un usuario.

Estos endpoints todavía no trabajan con datos reales. De momento sirven para
practicar métodos HTTP, rutas, parámetros y body.

3. **Rutas Temporales de Debug**

Estas rutas se han creado para practicar cómo leer datos de una petición HTTP y podrán eliminarse en fases avanzadas.

```http
POST /api/debug/body
GET /api/debug/params/:id
GET /api/debug/query
GET /api/debug/headers
PATCH /api/debug/users/:id
```

## Validaciones básicas

La API realiza validaciones manuales antes de crear o actualizar usuarios.

Validaciones principales:

- `name` debe ser un texto no vacío.
- `email` debe ser un texto no vacío.
- `password` debe ser un texto no vacío.
- `password` debe tener al menos 6 caracteres.
- `email` debe contener `@`.
- `isActive` debe ser boolean.

Ejemplo de error:

```json
{
  "error": "El nombre debe ser un texto no vacío"
}
```

### Validación de email

La API normaliza los emails antes de guardarlos o compararlos.

Proceso aplicado:

- `trim()`
- `toLowerCase()`
- Validación básica de formato.
- Comprobación de duplicados.

Ejemplo:

```text
"  USUARIO@EMAIL.COM  " -> "usuario@email.com"
```

Si se intenta crear o actualizar un usuario con un email ya existente, la API
responde:

```json
{
  "error": "El email ya está registrado"
}
```

Código:

```http
409 Conflict
```

## Ejemplos de Respuestas

1. **Listado de Usuarios `GET /api/users`**

```JSON
{
  "message": "Listado de usuarios",
  "total": 3,
  "data": [
    {
      "id": 1,
      "name": "Ana García",
      "email": "ana@email.com",
      "role": "USER",
      "isActive": true
    }
  ]
}
```

---

2. **Consultar Usuario por ID `GET /api/users/1`**

Respuesta Correcta (200 OK):

```JSON
{
  "message": "Usuario encontrado",
  "data": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@email.com",
    "role": "USER",
    "isActive": true
  }
}
```

Posibles Errores:

```json
400 Bad Request: {"error": "El ID debe ser un número"}

404 Not Found: {"error": "Usuario no encontrado"}
```

---

**3. Crear Usuario `POST /api/users`**

Petición (Body JSON):

```Json
{
  "name": "María López",
  "email": "maria@email.com",
  "password": "123456"
}
```

Respuesta Correcta (201 Created):

```json
{
  "message": "Usuario creado correctamente",
  "data": {
    "id": 4,
    "name": "María López",
    "email": "maria@email.com",
    "role": "USER",
    "isActive": true
  }
}
```

Posibles Errores:

Campos obligatorios faltantes (Error 400 Bad request):

```json
{
  "error": "name, email y password son obligatorios"
}
```

Longitud insuficiente de contraseña(Error 400 Bad request):

```json
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
```

Email duplicado(Error 409 Conflict):

```json
{
  "error": "El email ya está registrado"
}
```

---

**4. Actualizar Usuario `PATCH /api/users`**

Permite modificar parcialmente los datos de un usuario.

Campos permitidos:

```text
name
email
isActive
```

Body de ejemplo:

```json
{
  "name": "Ana Martínez"
}
```

Respuesta correcta:

```json
{
  "message": "Usuario actualizado correctamente",
  "data": {
    "id": 1,
    "name": "Ana Martínez",
    "email": "ana@email.com",
    "role": "USER",
    "isActive": true
  }
}
```

Posibles errores:

```json
{
  "error": "El ID debe ser un número",
  "received": "abc"
}
```

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

```json
{
  "error": "Debes enviar al menos un campo para actualizar"
}
```

```json
{
  "error": "El email ya está registrado"
}
```

---

**5. Eliminar o Desactivar Usuario `DELETE /api/users`**

```http
DELETE /api/users/:id
```

En este proyecto, esta ruta no borra físicamente el usuario. Realiza un borrado
lógico marcando:

```text
isActive = false
```

Respuesta correcta:

```json
{
  "message": "Usuario desactivado correctamente",
  "data": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@email.com",
    "role": "USER",
    "isActive": false
  }
}
```

Posibles errores:

```json
{
  "error": "El ID debe ser un número",
  "received": "abc"
}
```

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

## Códigos de estado utilizados

La API utiliza códigos HTTP para indicar el resultado de cada petición.

| Código | Significado | Uso en el proyecto |
| ---: | --- | --- |
| 200 | OK | Consulta, actualización o desactivación correcta |
| 201 | Created | Usuario creado correctamente |
| 400 | Bad Request | Datos incorrectos o incompletos |
| 404 | Not Found | Usuario no encontrado |
| 409 | Conflict | Email duplicado |

Ejemplo de error 404:

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

Ejemplo de error 409:

```json
{
  "error": "El email ya está registrado"
}
```

## Documentación del reto

- [Día 1 - Diseño inicial](docs/dia-01-diseno-inicial-usermanager.md)
- [Día 2 - Preparación del Proyecto](docs/dia-02-preparacion-proyecto.md)
- [Día 3 - Primer Endpoint](docs/dia-03-primer-endpoint.md)
- [Día 4 - Métodos HTTP](docs/dia-04-metodos-http.md)
- [Día 5 - JSON, body, params y headers](docs/dia-05-json-body-params-headers.md)
- [Día 6 - Cliente HTTP y depuración](docs/dia-06-cliente-http-depuracion.md)
- [Día 7 - Listado de usuarios en memoria](docs/dia-07-listado-usuarios.md)
- [Día 8 - Consultar usuario por ID](docs/dia-08-consultar-usuario-id.md)
- [Día 9 - Crear usuarios en memoria](docs/dia-09-crear-usuarios.md)
- [Día 10 - Actualizar usuarios en memoria](docs/dia-10-actualizar-usuarios.md)
- [Día 11 - Eliminar o desactivar usuarios en memoria](docs/dia-11-eliminar-desactivar-usuarios.md)
- [Día 12 - Validación manual básica](docs/dia-12-validacion-manual-basica.md)
- [Día 13 - Validación de email y duplicados](docs/dia-13-validacion-email-duplicados.md)
- [Día 14 - Códigos de estado HTTP](docs/dia-14-codigos-estado-http.md)

