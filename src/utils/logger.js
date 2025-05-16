import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";
import config from "../config/config.js";

// Niveles de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colores para cada nivel de log en consola
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Añadir colores a Winston
winston.addColors(colors);

// Determinar el nivel de log según el entorno
const level = () => {
  const env = process.env.NODE_ENV || "development";
  // Se podría extender para usar config.js si se agregan configuraciones de logging allí
  return env === "development" ? "debug" : "warn";
};

// Formato para los logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato para los logs en consola (con colores)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Transporte para la rotación de archivos de error
const errorRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join("logs", "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "error",
});

// Transporte para la rotación de archivos combinados
const combinedRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join("logs", "combined-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

// Transporte para la consola
const consoleTransport = new winston.transports.Console({
  format: consoleFormat,
});

// Instancia de logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [consoleTransport, errorRotateTransport, combinedRotateTransport],
});

// Middleware para Express para registrar solicitudes HTTP
export const httpLoggerMiddleware = (req, res, next) => {
  const { method, originalUrl } = req;
  const start = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - start;
    const statusCode = res.statusCode;

    const logMessage = `${method} ${originalUrl} ${statusCode} ${responseTime}ms`;

    if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.http(logMessage);
    }
  });

  next();
};

export default logger;
