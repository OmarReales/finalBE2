export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Códigos de error personalizados
  let status = 500;
  let message = "An internal server error occurred";

  // Manejar errores específicos
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error: " + err.message;
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    status = 409;
    message = "Duplicate key error: The resource already exists";
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  } else if (
    err.name === "TokenExpiredError" ||
    err.name === "JsonWebTokenError"
  ) {
    status = 401;
    message = "Authentication error: Token invalid or expired";
  } else if (err.message.includes("insufficient stock")) {
    status = 400;
    message = "Insufficient stock for the requested product(s)";
  }

  res.status(status).json({
    status: "error",
    message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
