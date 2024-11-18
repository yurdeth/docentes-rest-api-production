// Importar postgresql
import Pool from 'pg-pool';
import dotenv from "dotenv";

dotenv.config();

// Configuración de la conexión a la base de datos. Leer desde archivo ../.env
const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
});

export default db;
