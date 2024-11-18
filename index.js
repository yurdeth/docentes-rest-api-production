import express from "express";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import cors from "cors";
import {apiKeyMiddleware} from "./middleware/apiKeyMiddleware.js";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use("/api", routes);

const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh; /* Altura completa de la pantalla */
                    margin: 0;
                    background-color: #c9cdcc; /* Fondo gris claro */
                    font-family: Arial, sans-serif;
                }
                h1 {
                    color: #333;
                    text-align: center; /* Centrar el texto */
                }
            </style>
        </head>
        <body>
            <h1>Bienvenido a la API REST de Docentes</h1>
        </body>
        </html>
    `

app.get("/", function (req, res) {
    res.send(html);
});

app.get("/api", function (req, res) {
    res.send(html);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
