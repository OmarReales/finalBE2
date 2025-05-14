import { Router } from "express";
import {
  getCartById,
  createCart,
  addProductToCart,
  purchaseCart,
} from "../controllers/cart.controller.js";
import { passportCall, authorization } from "../utils/passportCall.js";

const router = Router();

router.get("/:cid", getCartById);
router.post("/", createCart);
router.post(
  "/:cid/product/:pid",
  passportCall("jwt"),
  authorization("user"),
  addProductToCart
);
router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization("user"),
  purchaseCart
);

export default router;
