import { Router } from "express";
import {
  getUsers,
  getUserById,
  saveUser,
  getCurrentUser,
  updateUser,
} from "../controllers/user.controller.js";
import { passportCall, authorization } from "../utils/passportCall.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("admin"), getUsers);
router.get("/current", passportCall("jwt"), getCurrentUser);
router.get("/:uid", passportCall("jwt"), getUserById);
router.post("/", saveUser);
router.put("/:uid", passportCall("jwt"), updateUser);

export default router;
