# Día 10: Actualizar usuarios en memoria

## Qué he hecho

- He actualizado el endpoint `PATCH /api/users/:id`.
- He leído el ID desde `req.params`.
- He leído los cambios desde `req.body`.
- He validado que el ID sea numérico.
- He comprobado si el usuario existe.
- He validado que el body no esté vacío.
- He validado `name`, `email` e `isActive`.
- He comprobado email duplicado al actualizar.
- He actualizado `updatedAt`.
- He sustituido el usuario dentro del array.

## Endpoint trabajado

```http
PATCH /api/users/:id
```

## Body de ejemplo

```json
{
  "name": "Ana Martínez"
}
```

## Casos probados

| Caso                   | Código esperado | Resultado                                                                                             |
| ---------------------- | --------------: | ----------------------------------------------------------------------------------------------------- |
| Actualización correcta |             200 | OK — Devuelve el objeto `data` con las propiedades actualizadas y el nuevo timestamp en `updatedAt`.  |
| ID no válido           |             400 | Bad Request — `{"error": "El ID debe ser un número", "received": "abc"}`                              |
| Usuario inexistente    |             404 | Not Found — `{"error": "Usuario no encontrado", "id": 999}`                                           |
| Body vacío             |             400 | Bad Request — `{"error": "Debes enviar al menos un campo para actualizar (name, email o isActive)"}`  |
| Nombre vacío           |             400 | Bad Request — `{"error": "El nombre no puede estar vacío"}` (al enviar solo espacios o `""`).         |
| Email inválido         |             400 | Bad Request — `{"error": "El email no tiene un formato válido"}` (al faltar `@`).                     |
| Email duplicado        |             409 | Conflict — `{"error": "El email ya está registrado por otro usuario"}`                                |
| `isActive` incorrecto  |             400 | Bad Request — `{"error": "isActive debe ser true o false"}` (al enviar un tipo distinto a `boolean`). |

## Explicación personal

Para actualizar un usuario se lee el ID desde `req.params`, se busca el usuario
en el array, se leen los cambios desde `req.body` y se sustituyen solo los
campos que han llegado en la petición.

## PATCH

### ¿Qué significa actualizar parcialmente?

Actualizar parcialmente significa modificar **únicamente las propiedades que han cambiado**, dejando intactas el resto de las propiedades del recurso.

A diferencia de una sustitución completa, la API solo procesa los campos que el cliente envía explícitamente en el cuerpo de la petición (`req.body`), conservando el estado previo de los datos que no se han especificado.

### ¿Qué diferencia hay entre enviar solo `name` y enviar todo el usuario?

- **Enviar solo `name` (`PATCH` parcial):** El cliente manda una petición reducida (por ejemplo `{ "name": "Nuevo Nombre" }`). El servidor actualiza la propiedad `name`, pero mantiene el `email`, el `role`, el estado `isActive` y la fecha de creación `createdAt` con sus valores originales.
- **Enviar el usuario completo:** Implica enviar la totalidad de las propiedades en la petición. Si se enviara todo el objeto pero se omitiera un campo existente (por ejemplo, sin incluir `email`), ese campo se perdería o quedaría como `undefined` si no se manejara adecuadamente.

`PATCH` nos da la flexibilidad de modificar solo lo necesario sin riesgo de borrar o sobreescribir datos accidentales.

### ¿Por qué no permitimos modificar campos como `id` o `role` desde esta ruta?

1. **Inmutabilidad del `id`:** El `id` es el identificador único e inalterable de un recurso en la base de datos. Permitir que se modifique rompería la integridad referencial y las relaciones del sistema.
2. **Seguridad en el `role`:** El rol de un usuario (`USER`, `ADMIN`, etc.) determina sus permisos dentro de la aplicación. Permitir que cualquier usuario modifique su propio rol desde un endpoint de edición de perfil general crearía una vulnerabilidad crítica de elevación de privilegios. Las modificaciones de rol deben realizarse desde rutas específicas protegidas y reservadas a administradores (como `PATCH /api/users/:id/role`).
