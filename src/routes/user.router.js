import { Router } from "express";
import {
  getUsers,
  getUserById,
  saveUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { passportCall, authorization } from "../utils/passportCall.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("admin"), getUsers);
router.get("/:uid", passportCall("jwt"), getUserById);
router.post("/", saveUser);
router.get("/current", passportCall("jwt"), getCurrentUser);

export default router;
