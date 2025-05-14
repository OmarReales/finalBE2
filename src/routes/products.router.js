import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { passportCall, authorization } from "../utils/passportCall.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", passportCall("jwt"), authorization("admin"), createProduct);
router.put("/:pid", passportCall("jwt"), authorization("admin"), updateProduct);
router.delete(
  "/:pid",
  passportCall("jwt"),
  authorization("admin"),
  deleteProduct
);

export default router;
