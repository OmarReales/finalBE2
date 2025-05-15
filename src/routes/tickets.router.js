import { Router } from "express";
import {
  getAllTickets,
  getTicketByCode,
  getUserTickets,
} from "../controllers/ticket.controller.js";
import { passportCall, authorization } from "../utils/passportCall.js";

const router = Router();

router.get("/", passportCall("jwt"), authorization("admin"), getAllTickets);
router.get("/user", passportCall("jwt"), getUserTickets);
router.get("/:code", passportCall("jwt"), getTicketByCode);

export default router;
