import express from "express";

const app = express(); // Creamos una instancia de la aplicación Express
const PORT = 3000; // Definimos el puerto en el que escuchará el servidor

app.use(express.json()); //Permite leer JSON en las solicitudes entrantes

app.get("/", (req, res) => { // Creamos un endpoint con GET en la raíz del servidor
  res.json({
     name: "UserManager API",
     version: "1.0.0",
     status: "running",
     author: "Daniel M.H.",
    });
});

app.get("/api/info", (req, res) => { // Creamos un endpoint con GET para obtener información de la API
    res.json({
            project: "UserManager API",
            description: "API REST para gestionar usuarios",
            day: 2,
            technologies: ["Node.js", "Express", "TypeScript"],
        });
    });

app.get("/api/health", (req, res) =>{ // Creamos un endpoint con GET para verificar el estado de la API
    res.status(200).json({
        status: "200 OK",
        message: "UserManager API funcionando correctamente",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        environment: "development"
    });
});

app.get("/api/ping", (req, res) => { // Creamos un endpoint con GET para verificar la latencia de la API
    res.json({
        message: "pong",
        timestamp: new Date().toISOString(), 
    });
});

app.listen(PORT, () => { //Arrancamos el servidor y escuchamos en el puerto definido
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});