# Día 24 - Seed de datos iniciales

## Qué he hecho

- He creado el archivo prisma/seed.ts.
- He usado Prisma Client dentro del seed.
- He creado un usuario ADMIN inicial.
- He creado un usuario USER activo.
- He creado un usuario USER inactivo.
- He usado upsert para evitar duplicados.
- He configurado el comando de seed.
- He ejecutado prisma db seed.
- He comprobado los datos con Prisma Studio.
- He ejecutado el seed más de una vez para comprobar que no duplica usuarios.

## Comando principal

```bash
npx prisma db seed
```

O mediante script:

```bash
npm run prisma:seed
```

## Usuarios creados

| Nombre           | Email              | Role  | Activo |
| ---------------- | ------------------ | ----- | ------ |
| Admin Principal  | admin@email.com    | ADMIN | sí     |
| Usuario Demo     | user@email.com     | USER  | sí     |
| Usuario Inactivo | inactive@email.com | USER  | no     |

## Archivo creado

```text
prisma/seed.ts
```

## Explicación de upsert

`upsert` permite crear un registro si no existe o actualizarlo si ya existe.

En este seed se usa para que los usuarios iniciales no se dupliquen aunque ejecutemos el comando varias veces.

## Nota sobre passwordHash

De momento se usan valores temporales como:

```text
hash_temporal_admin123
```

Más adelante, en la fase de seguridad, estos valores se sustituirán por hashes reales generados con bcrypt.

## Datos manuales frente a seed

| Forma de crear datos | Ventaja                                            | Problema                          |
| -------------------- | -------------------------------------------------- | --------------------------------- |
| Prisma Studio        | Rápido para pruebas puntuales                      | No queda documentado en el código |
| Adminer              | Permite trabajar directamente con la base de datos | Puede ser fácil cometer errores   |
| Seed                 | Repetible y versionado                             | Requiere escribir un script       |

El seed es la opción más adecuada para datos iniciales del proyecto.

---

```mermaid
flowchart LR
    A[prisma/seed.ts] --> B[Prisma Client]
    B --> C[PostgreSQL]
    C --> D[Usuarios iniciales]
```

El archivo seed.ts usa Prisma Client para insertar usuarios iniciales en PostgreSQL. Después podemos comprobarlos con Prisma Studio.

## Qué es un seed

Un **seed** (_semilla_) es un script automatizado que puebla la base de datos con un conjunto inicial y controlado de registros para que el proyecto pueda arrancar con información funcional desde el primer momento.

### Utilidad principal durante el desarrollo:

- **Entorno listo para usar:** Evita arrancar con la base de datos vacía, proporcionando usuarios de prueba y datos de ejemplo inmediatos sin crearlos a mano.
- **Consistencia en el equipo:** Asegura que todos los desarrolladores y tests automatizados trabajen sobre el mismo estado de datos reproducible.
- **Inicialización de datos esenciales:** Permite cargar registros críticos e indispensables para que el sistema opere (como el usuario administrador inicial o catálogos maestros).
- **Idempotencia y limpieza:** Está diseñado para poder ejecutarse múltiples veces (`npx prisma db seed`), restableciendo la base de datos a un estado conocido sin provocar duplicados ni errores.

## Por qué usamos upsert

El término **`upsert`** es una combinación de las operaciones **`UPDATE`** e **`INSERT`**. En Prisma, este método busca un registro por un campo único (como el `email`): si ya existe en la base de datos, lo **actualiza** (`update`); si no existe, lo **crea** (`create`).

---

### ¿Qué problema tendríamos si usáramos `create`?

Si en el archivo de seed utilizáramos el método `prisma.user.create()` e intentáramos ejecutar el script una segunda vez:

1. **Error de clave duplicada (`P2002`):** Como el campo `email` tiene una restricción de unicidad (`@unique`), al intentar insertar un usuario que ya fue creado en la primera ejecución, PostgreSQL rechazará la operación inmediatamente (`Unique constraint failed on the fields: (email)`).
2. **Fallo en cascada del script:** La ejecución del seed se detendrá de golpe al encontrar el primer error, dejando la base de datos a medio poblar o en un estado inconsistente.
3. **Pérdida de tiempo en desarrollo:** Para volver a lanzar el seed, el desarrollador se vería obligado a borrar manualmente las tablas o resetear la base de datos completa antes de cada ejecución.

---

### Ventajas de usar `upsert`

- **Idempotencia:** El script de seed se vuelve _idempotente_, lo que significa que **se puede ejecutar 1, 10 o 100 veces consecutivas y el resultado final siempre será el mismo**, sin errores ni duplicados.
- **Actualizaciones automáticas:** Si modificamos los datos de prueba en el código del seed (por ejemplo, corregimos el nombre de un usuario o cambiamos su rol), al volver a ejecutar el comando, `upsert` actualizará automáticamente el registro existente con los nuevos valores.
- **Seguridad en entornos compartidos:** Permite a cualquier compañero de equipo o pipeline de CI/CD ejecutar el comando de seed en cualquier momento sin miedo a romper la base de datos local.

## Comparar migración y seed

| Concepto  | Cambia estructura | Inserta datos | Se guarda en el repositorio |
| --------- | ----------------- | ------------- | --------------------------- |
| Migración | Si                | No            | Si                          |
| Seed      | NO                | Si            | Si                          |

## Preparar los datos para futuras pruebas

Añade una tabla al documento con casos de prueba futuros:

| Caso futuro                      | Usuario que servirá para probarlo     |
| -------------------------------- | ------------------------------------- |
| Login como ADMIN                 | Admin Principal (admin@email.com)     |
| Login como USER                  | Usuario Estándar (user@email.com)     |
| Usuario inactivo no puede entrar | Usuario Inactivo (inactive@email.com) |
| ADMIN lista usuarios             | Admin Principal (admin@email.com)     |
| USER no puede listar usuarios    | Usuario Estándar (user@email.com)     |
