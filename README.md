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

| Código | Significado | Uso en el proyecto                               |
| -----: | ----------- | ------------------------------------------------ |
|    200 | OK          | Consulta, actualización o desactivación correcta |
|    201 | Created     | Usuario creado correctamente                     |
|    400 | Bad Request | Datos incorrectos o incompletos                  |
|    404 | Not Found   | Usuario no encontrado                            |
|    409 | Conflict    | Email duplicado                                  |

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

## Gestión centralizada de errores

La API utiliza un middleware global para devolver errores con un formato común.

Formato general:

```json
{
  "error": "Mensaje del error",
  "statusCode": 400,
  "details": {},
  "path": "/api/users/abc",
  "method": "GET",
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

También se ha añadido un middleware para rutas no encontradas:

```http
GET /api/ruta-inventada
```

Respuesta:

```json
{
  "error": "Ruta no encontrada",
  "statusCode": 404
}
```

## Persistencia

Hasta el día 15, la API trabaja con usuarios en memoria.

Esto significa que los datos se pierden al reiniciar el servidor.

A partir de la siguiente fase, prepararemos una base de datos para guardar los
usuarios de forma persistente.

Tabla principal prevista:

```text
users
```

Campos principales:

```text
id
name
email
password_hash
role
is_active
created_at
updated_at
```

## Base de datos con Docker Compose

El proyecto utiliza Docker Compose para levantar PostgreSQL y Adminer.

Servicios:

```text
postgres  -> Base de datos PostgreSQL
adminer   -> Interfaz web para consultar la base de datos
```

Comando para arrancar:

```bash
docker compose up -d
```

Comando para parar:

```bash
docker compose down
```

Adminer:

```text
http://localhost:8080
```

Datos de conexión:

```text
Sistema: PostgreSQL
Servidor: postgres
Usuario: usermanager
Contraseña: usermanager_password
Base de datos: usermanager_db
```

## Modelo persistente User

El modelo principal del proyecto será `User`.

Campos principales:

```text
id
name
email
passwordHash
role
isActive
createdAt
updatedAt
```

Reglas importantes:

```text
email único
passwordHash nunca se devuelve
role por defecto USER
isActive por defecto true
createdAt y updatedAt automáticos
```

Este diseño se convertirá más adelante en un modelo Prisma.

## ORM y acceso a datos

El proyecto usará Prisma como ORM principal para comunicarse con PostgreSQL.

Se ha elegido Prisma porque:

```text
Encaja bien con TypeScript.
Permite definir modelos claros.
Incluye migraciones.
Genera un cliente tipado.
Permite explorar datos con Prisma Studio.
```

Flujo previsto:

```mermaid
API Express → Repository → Prisma → PostgreSQL
```

```mermaid
flowchart LR
    A[API Express ] --> B[Repository]
    B --> C[Prisma]
    C --> D[ PostgreSQL]
```

SQL directo, TypeORM y Sequelize se han considerado como alternativas, pero no serán el camino principal del reto.

## Prisma

Instalación:

```bash
npm install -D prisma
npm install @prisma/client
```

Inicialización:

```bash
npx prisma init --datasource-provider postgresql
```

Archivos importantes:

```text
prisma/schema.prisma
.env
.env.example
```

Validar esquema:

```bash
npx prisma validate
```

Generar cliente:

```bash
npx prisma generate
```

## Modelo Prisma User

El modelo principal del proyecto será `User`.

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Reglas principales:

```text
email único
passwordHash obligatorio
role por defecto USER
isActive por defecto true
createdAt automático
updatedAt automático al modificar
```

## Migraciones con Prisma

El proyecto usa Prisma Migrate para versionar la estructura de la base de datos.

Primera migración:

```bash
npx prisma migrate dev --name init
```

Esto genera:

```text
prisma/migrations/<timestamp>_init/migration.sql
```

Y crea en PostgreSQL:

```text
User
_prisma_migrations
```

La tabla `User` almacena los usuarios de la aplicación.

La tabla `_prisma_migrations` guarda el historial interno de migraciones de Prisma.

## Prisma Studio

Prisma Studio permite explorar visualmente los datos de la base de datos.

Comando:

```bash
npx prisma studio
```

O mediante script:

```bash
npm run prisma:studio
```

URL habitual:

```text
http://localhost:5555
```

Uso en el proyecto:

```text
Comprobar tablas.
Revisar usuarios.
Ver datos iniciales del seed.
Comprobar cambios realizados desde la API.
Detectar errores de persistencia.
```

Prisma Studio es una herramienta de desarrollo. La gestión real de usuarios se hará desde la API.

## Seed de datos iniciales

El proyecto incluye un seed para crear usuarios iniciales.

Archivo:

```text
prisma/seed.ts
```

Ejecutar seed:

```bash
npx prisma db seed
```

O mediante script:

```bash
npm run prisma:seed
```

Usuarios iniciales:

| Email                | Role    | Estado   |
| -------------------- | ------- | -------- |
| `admin@email.com`    | `ADMIN` | activo   |
| `user@email.com`     | `USER`  | activo   |
| `inactive@email.com` | `USER`  | inactivo |

Nota:

```text
Los passwordHash son temporales hasta implementar bcrypt en la fase de seguridad.
```

## Consultas básicas con Prisma

La API ya puede consultar usuarios desde PostgreSQL usando Prisma Client.

Archivo de cliente compartido:

```text
src/prisma.ts
```

Este proyecto usa Prisma 7 con adapter PostgreSQL:

```ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
```

Rutas temporales de prueba:

| Método | Ruta                             | Acción                  |
| ------ | -------------------------------- | ----------------------- |
| GET    | `/api/debug/prisma/users`        | Listar usuarios         |
| GET    | `/api/debug/prisma/users-active` | Listar usuarios activos |
| GET    | `/api/debug/prisma/users/:id`    | Buscar usuario por ID   |
| POST   | `/api/debug/prisma/users`        | Crear usuario           |

Regla:

```text
Las respuestas no deben incluir passwordHash.
```

## Separación de rutas

El proyecto empieza a organizarse por capas.

Primera carpeta creada:

```text
src/routes/
```

Archivos actuales:

```text
src/routes/health.routes.ts
src/routes/debug-prisma.routes.ts
```

server.ts monta los routers:

```ts
app.use("/api/health", healthRouter);
app.use("/api/debug/prisma", debugPrismaRouter);
```

Esta separación permite que server.ts quede más limpio y que el proyecto pueda crecer hacia una arquitectura con controladores, servicios y repositorios.

## Controladores

El proyecto empieza a separar la lógica HTTP en controladores.

Carpeta creada:

```text
src/controllers/
```

Archivos actuales:

```text
src/controllers/health.controller.ts
src/controllers/user.controller.ts
```

Ejemplo de ruta simplificada:

```ts
debugPrismaRouter.get("/users", getUsers);
```

La lógica de la petición queda en el controlador:

```text
getUsers
getUserById
createDebugUser
```

Esta separación prepara el proyecto para añadir servicios y repositorios.

## Servicios

El proyecto ya incluye una capa de servicios.

Carpeta creada:

```text
src/services/
```

Archivo principal:

```text
src/services/user.service.ts
```

Los servicios contienen lógica de negocio como:

- Validar datos.
- Normalizar email.
- Comprobar usuario inexistente.
- Gestionar email duplicado.
- Crear usuarios.

El controlador queda más limpio y llama a funciones como:

```ts
getUsersService();
getUserByIdService(id);
createDebugUserService(req.body);
```

En este punto, el servicio todavía usa Prisma directamente. En el siguiente paso se añadirá una capa de repositorios.

## Repositorios

El proyecto ya incluye una capa de repositorios.

Carpeta creada:

```text
src/repositories/
```

Archivo principal:

```text
src/repositories/user.repository.ts
```

Funciones actuales:

- `findAllUsers`
- `findActiveUsers`
- `findUserById`
- `findUserByEmail`
- `createUser`

Flujo actual de la API: `Route → Controller → Service → Repository → Prisma → PostgreSQL`.

El servicio ya no usa Prisma directamente. Ahora el acceso a datos queda concentrado en el repositorio.

## CRUD persistente de usuarios

La API ya tiene rutas reales para gestionar usuarios con PostgreSQL y Prisma.

Rutas principales:

| Método | Ruta             | Acción             |
| ------ | ---------------- | ------------------ |
| GET    | `/api/users`     | Listar usuarios    |
| GET    | `/api/users/:id` | Consultar usuario  |
| POST   | `/api/users`     | Crear usuario      |
| PATCH  | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Desactivar usuario |

Flujo interno:

```text
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

El borrado es lógico:

```text
DELETE /api/users/:id → isActive = false
```

La API nunca devuelve `passwordHash`.

## Arquitectura actual

El proyecto sigue una arquitectura por capas:

```text
Route → Controller → Service → Repository → Prisma → PostgreSQL
```

Estructura principal:

```text
src/
  prisma.ts
  server.ts
  controllers/
    health.controller.ts
    user.controller.ts
  errors/
    AppError.ts
  repositories/
    user.repository.ts
  routes/
    health.routes.ts
    user.routes.ts
  services/
    user.service.ts
  utils/
    parse.utils.ts
    string.utils.ts
```

Rutas principales:

| Método | Ruta             | Acción                     |
| ------ | ---------------- | -------------------------- |
| GET    | `/api/health`    | Comprobar estado de la API |
| GET    | `/api/users`     | Listar usuarios            |
| GET    | `/api/users/:id` | Consultar usuario          |
| POST   | `/api/users`     | Crear usuario              |
| PATCH  | `/api/users/:id` | Actualizar usuario         |
| DELETE | `/api/users/:id` | Desactivar usuario         |

## Seguridad de contraseñas

El proyecto usa `bcrypt` para hashear contraseñas antes de guardarlas en la base de datos.

Instalación:

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

Utilidades principales:

```text
src/utils/password.utils.ts
```

Funciones:

```ts
hashPassword(password);
comparePassword(password, passwordHash);
```

Reglas:

- La API recibe `password`.
- La base de datos guarda `passwordHash`.
- La contraseña en texto plano nunca se guarda.
- `passwordHash` nunca se devuelve al cliente.

## Autenticación

El proyecto ya incluye una primera ruta de autenticación para registro de usuarios.

Ruta:

`POST /api/auth/register`

Body esperado:

```json
{
  "name": "Usuario Nuevo",
  "email": "nuevo@email.com",
  "password": "123456"
}
```

Respuesta correcta:

`201 Created`.

Reglas:

- El email no puede estar repetido.
- La contraseña se guarda como `passwordHash` usando `bcrypt`.
- El usuario se registra con `role USER` por defecto.
- El usuario se registra activo por defecto.
- `passwordHash` nunca se devuelve al cliente.

Todavía no se genera token JWT. Eso se añadirá más adelante.

### Login

Ruta:

```text
POST /api/auth/login
```

Body esperado:

```json
{
  "email": "user@email.com",
  "password": "user123"
}
```

Respuesta correcta:

```text
200 OK
```

Respuesta aproximada:

```json
{
  "message": "Login correcto",
  "data": {
    "user": {
      "id": 2,
      "name": "Usuario Demo",
      "email": "user@email.com",
      "role": "USER",
      "isActive": true
    }
  }
}
```

Reglas:

- El email debe existir.
- La contraseña debe coincidir con el `passwordHash`.
- El usuario debe estar activo.
- `passwordHash` nunca se devuelve.
- Todavía no se devuelve token JWT.

### Login

Ruta:

```text
POST /api/auth/login
```

Body esperado:

```json
{
  "email": "user@email.com",
  "password": "user123"
}
```

Respuesta correcta:

```json
{
  "message": "Login correcto",
  "data": {
    "user": {
      "id": 2,
      "name": "Usuario Demo",
      "email": "user@email.com",
      "role": "USER",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

El token es un JWT firmado con `JWT_SECRET`.

Variables necesarias:

```env
JWT_SECRET="cambia_esta_clave_en_produccion"
JWT_EXPIRES_IN="1h"
```

Reglas:

- El token se genera solo si el login es correcto.
- El token contiene `userId`, `email` y `role`.
- El token no contiene `password` ni `passwordHash`.
- Todavía no se usa para proteger rutas.

## Middleware de autenticación

El proyecto ya puede verificar tokens JWT enviados por el cliente.

Formato de la cabecera:

```text
Authorization: Bearer <token>
```

Middleware creado:

```text
src/middlewares/auth.middleware.ts
```

El middleware:

- Lee la cabecera `Authorization`.
- Comprueba que el formato sea `Bearer`.
- Verifica el token con `JWT_SECRET`.
- Guarda los datos autenticados en `req.user`.
- Bloquea la petición si el token falta o es inválido.

Ruta de prueba:

`GET /api/auth/me`

Rutas protegidas:

`/api/users/*`

Todavía no se aplican permisos por rol. Eso se trabajará en el siguiente paso.

## Arquitecura

```text
src/
  controllers/
    auth.controller.ts
    health.controller.ts
    user.controller.ts
  errors/
    AppError.ts
  middlewares/
    auth.middleware.ts
  repositories/
    user.repository.ts
  routes/
    auth.routes.ts
    health.routes.ts
    user.routes.ts
  services/
    auth.service.ts
    user.service.ts
  types/
    auth.types.ts
  utils/
    jwt.utils.ts
    parse.utils.ts
    password.utils.ts
    string.utils.ts
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
- [Día 15 - Middleware centralizado de errores](docs/dia-15-middleware-errores.md)
- [Día 16 - Base de datos y persistencia](docs/dia-16-base-datos-persistencia.md)
- [Día 17 - PostgreSQL con Docker Compose](docs/dia-17-postgresql-docker-compose.md)
- [Día 18 - Diseño del modelo persistente User](docs/dia-18-diseno-modelo-persistente-user.md)
- [Día 19 - ORM o acceso a datos](docs/dia-19-orm-acceso-datos.md)
- [Día 20 - Instalación y configuración inicial de Prisma](docs/dia-20-instalacion-prisma.md)
- [Día 21 - Modelo Prisma User](docs/dia-21-modelo-prisma-user.md)
- [Día 22 - Primera migración con Prisma](docs/dia-22-primera-migracion-prisma.md)
- [Día 23 - Prisma Studio](docs/dia-23-prisma-studio.md)
- [Día 24 - Seed de datos iniciales](docs/dia-24-seed-datos-iniciales.md)
- [Día 25 - Consultas básicas con Prisma Client](docs/dia-25-consultas-basicas-prisma.md)
- [Día 26 - Separar rutas](docs/dia-26-separar-rutas.md)
- [Día 27 - Controladores](docs/dia-27-controladores.md)
- [Día 28 - Servicios](docs/dia-28-servicios.md)
- [Día 29 - Repositorio con Prisma](docs/dia-29-repositorio-prisma.md)
- [Día 30 - CRUD persistente ordenado](docs/dia-30-crud-persistente-ordenado.md)
- [Día 31 - Limpieza y refactor](docs/dia-31-limpieza-refactor.md)
- [Día 32 - Contraseñas seguras con bcrypt](docs/dia-32-bcrypt-passwords.md)
- [Día 33 - Registro de usuarios](docs/dia-33-auth-register.md)
- [Día 34 - Login de usuarios](docs/dia-34-auth-login.md)
- [Día 35 - Generación de token JWT](docs/dia-35-jwt.md)
- [Día 36 - Middleware de autenticación](docs/dia-36-auth-middleware.md)
