import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  // Códigos de error personalizados
  let status = 500;
  let message = "An internal server error occurred";

  // Manejar errores específicos
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error: " + err.message;
    logger.warn(`Validation error: ${err.message}`);
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    status = 409;
    message = "Duplicate key error: The resource already exists";
    logger.warn(`Duplicate key error: ${JSON.stringify(err.keyValue)}`);
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
    logger.warn(`Cast error: ${err.message}`);
  } else if (
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError"
  ) {
    status = 401;
    message = "Authentication error: Token invalid or expired";
    logger.warn(`JWT error: ${err.message}`);
  } else if (err.message.includes("insufficient stock")) {
    status = 400;
    message = "Insufficient stock for the requested product(s)";
    logger.warn(`Insufficient stock: ${err.message}`);
  } else {
    // Error desconocido, logueamos con más detalles
    logger.error(`Unhandled error: ${err.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user ? req.user.id : "unauthenticated",
    });
  }

  res.status(status).json({
    status: "error",
    message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
