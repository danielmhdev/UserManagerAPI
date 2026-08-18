// Preparación Proyecto y configuración

import express, {Request, Response, NextFunction} from "express";

import { healthRouter } from "./routes/health.routes";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import { AppError } from "./errors/AppError";

const app = express(); // Creamos una instancia de la aplicación Express
const PORT = process.env.PORT ||3000; // Definimos el puerto en el que escuchará el servidor
app.use(express.json()); //Permite leer JSON en las solicitudes entrantes(POST,PUT...)

app.use("/api/health", healthRouter); // Añadimos el router de salud a la ruta /health
app.use("/api/auth", authRouter); // Añadimos el router de autenticación a la ruta /api/auth
app.use("/api/users", userRouter); // Añadimos el router de usuarios a la ruta /api/users

// ==========================================
// Middlewares
// ==========================================
// De rutas no encontradas (404)
function notFoundMiddleware(req: Request, res: Response, next: NextFunction){
  next(
    new AppError ("No existe la ruta " + req.originalUrl, 404,));
}
// Global de errores
function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const details = isAppError ? err.details : undefined;

  return res.status(statusCode).json({
    error: isAppError ? err.message : "Error interno del servidor",
    statusCode,
    details,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

// ==========================================
//Arrancamos el servidor escuchando en el puerto definido, y añadimos los middlewares de error y ruta no encontrada
// ==========================================
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
