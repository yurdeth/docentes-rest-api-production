// logger.js
import { createLogger, format, transports } from 'winston';

// Crear el logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(), // Mostrar logs en la consola
        new transports.File({ filename: 'error.log', level: 'error' }), // Guardar errores en un archivo
        new transports.File({ filename: 'combined.log' }) // Guardar todos los logs en otro archivo
    ]
});

export default logger;
