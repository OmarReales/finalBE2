import jwt from "jsonwebtoken";
import config from "../config/config.js";

const PRIVATE_KEY = config.JWT_SECRET;

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

export const isLoggedOut = (req, res, next) => {
  const authHeader = req.cookies.authToken;
  if (!authHeader) {
    return res.status(401).send({ status: "error", error: "Unauthorized" });
  } else {
    next();
  }
};
