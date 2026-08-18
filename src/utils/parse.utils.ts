// Para alamacenar funciones auxiliares reutilizables.
import { AppError } from "../errors/AppError";

export function parseIdParam(value: string) {
  const id = Number(value);

  if (Number.isNaN(id)) {
    throw new AppError("El ID debe ser un número", 400, {
      received: value,
    });
  }

  return id;
}
