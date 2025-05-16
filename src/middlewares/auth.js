// NOTA: Este archivo contiene middleware de autenticación alternativo
// que actualmente no se está utilizando en el proyecto.
// Se mantiene como referencia, pero se recomienda usar passportCall.js
// para la autenticación y autorización.

import jwt from "jsonwebtoken";
import config from "../config/config.js";
import logger from "../utils/logger.js";

const PRIVATE_KEY = config.JWT_SECRET;

/**
 * @deprecated Use passportCall("jwt") instead
 */
export const isLoggedIn = (req, res, next) => {
  const authHeader = req.cookies.authToken;
  if (!authHeader) {
    return res.status(401).send({ status: "error", error: "Unauthorized" });
  }
  let token;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = authHeader;
  }

  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).send({ status: "error", error: "Forbidden" });
    }
    req.user = credentials;
    next();
  });
};

/**
 * @deprecated This method is not currently used in the application
 */
export const isLoggedOut = (req, res, next) => {
  const authHeader = req.cookies.authToken;
  if (!authHeader) {
    logger.warn("Unauthorized access attempt detected");
    return res.status(401).send({ status: "error", error: "Unauthorized" });
  } else {
    next();
  }
};
