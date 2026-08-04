# Día 11 - Eliminar o desactivar usuarios en memoria

## Qué he hecho

- He actualizado el endpoint `DELETE /api/users/:id`.
- He leído el ID desde `req.params`.
- He validado que el ID sea numérico.
- He comprobado si el usuario existe.
- He aplicado borrado lógico usando `isActive = false`.
- He actualizado `updatedAt`.
- He comprobado que el usuario sigue existiendo en el listado.
- He probado casos de error.

## Endpoint trabajado

```http
DELETE /api/users/:id
```

## Casos probados

| Caso | Código esperado | Resultado |
| --- | ---: | --- |
| Desactivar usuario existente | 200 | OK — Devuelve `{"message": "Usuario desactivado correctamente", "data": ...}` con `isActive: false` y la fecha de actualización en `updatedAt`. |
| ID no válido | 400 | Bad Request — `{"error": "El ID debe ser un número", "received": "abc"}` |
| Usuario inexistente | 404 | Not Found — `{"error": "Usuario no encontrado", "id": 999}` |
| Consultar usuario desactivado | 200 | OK — `GET /api/users/:id` devuelve los datos del usuario mostrando `isActive: false`. |
| Consultar listado después de desactivar | 200 | OK — `GET /api/users` incluye al usuario en el listado general con su propiedad `isActive` actualizada a `false`. |

## Explicación personal

En este proyecto `DELETE` no borra físicamente el usuario. En lugar de
eliminarlo del array, lo marcamos como inactivo cambiando `isActive` a `false`.
Esto se llama borrado lógico.

## Borrado físico vs borrado lógico

### ¿Qué sería borrar físicamente un usuario?
El borrado físico (o *Hard Delete*) consiste en **eliminar permanentemente la fila o el registro** de la base de datos (por ejemplo, usando métodos como `.splice()` en un array o la instrucción `DELETE FROM users` en SQL). Una vez ejecutado, la información desaparece del sistema y es irrecuperable a menos que se recurra a una copia de seguridad (*backup*).

### ¿Qué significa hacer un borrado lógico?
El borrado lógico (o *Soft Delete*) consiste en **marcar el registro como inactivo o eliminado sin borrarlo físicamente** de la memoria o base de datos. Para lograrlo, se actualiza un campo del propio registro (como `isActive: false` o añadiendo una fecha en `deletedAt`). Para la aplicación y el usuario final el recurso figura como "borrado" o inhabilitado, pero los datos siguen existiendo internamente.

### ¿Por qué en este proyecto usamos `isActive = false`?
En nuestra API utilizamos `isActive = false` porque implementamos un **borrado lógico**. Cuando un cliente envía una petición `DELETE /api/users/:id`, la API no destruye el objeto del array, sino que actualiza su estado a inactivo y registra el momento del cambio en `updatedAt`. Esto preserva la estructura del array de usuarios y simula el comportamiento estándar de la industria.

### ¿Qué ventajas tiene conservar el usuario en lugar de eliminarlo?
1. **Recuperación sencilla:** Si un usuario se elimina por error o solicita reactivar su cuenta, basta con cambiar el estado a `isActive: true` sin necesidad de volver a crear el perfil desde cero.
2. **Auditoría e Historial:** Permite llevar un registro preciso de cuándo se desactivó la cuenta (`updatedAt`) y analizar qué usuarios han abandonado la plataforma.
3. **Integridad Referencial:** En sistemas reales con pedidos, facturas, mensajes o registros de actividad, borrar físicamente un usuario provocaría "datos huérfanos" (facturas asignadas a un `user_id` que ya no existe) causando errores graves en la base de datos. Conservar el registro evita que se rompan esas relaciones.