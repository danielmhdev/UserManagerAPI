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