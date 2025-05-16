import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { passportCall } from "../utils/passportCall.js";
import logger from "../utils/logger.js";
import {
  validateLogin,
  validateRegister,
} from "../middlewares/validator.middleware.js";

const router = Router();

router.post(
  "/register",
  validateRegister,
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerfail",
  }),
  async (req, res) => {
    res.send({ status: "success", message: "User registered successfully" });
  }
);
router.post(
  "/login",
  validateLogin,
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginfail",
  }),
  async (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 1000, // 1 hora
        sameSite: "strict", // Protección CSRF
      })
      .send({
        status: "success",
        message: "User logged in successfully",
        token,
      });
  }
);
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");

  return res.json({
    status: "success",
    message: "Logout successful",
  });
});

router.get("/current", passportCall("jwt"), getCurrentUser);

// Rutas para manejar errores de autenticación
router.get("/registerfail", (req, res) => {
  logger.warn("Registration failed attempt");
  res.status(400).json({
    status: "error",
    message: "Registration failed. Please check your input and try again.",
  });
});

router.get("/loginfail", (req, res) => {
  logger.warn("Login failed attempt");
  res.status(401).json({
    status: "error",
    message: "Login failed. Invalid credentials.",
  });
});

export default router;
