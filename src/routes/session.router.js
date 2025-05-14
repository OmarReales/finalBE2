import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/registerfail" }),
  async (req, res) => {
    res.send({ status: "success", message: "User registered successfully" });
  }
);
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginfail" }),
  async (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("authToken", token, { httpOnly: true, secure: true }).send({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  }
);

export default router;
