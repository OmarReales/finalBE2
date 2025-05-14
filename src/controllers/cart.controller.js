import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
import TicketService from "../services/ticket.service.js";
import CartDTO from "../dto/cart.dto.js";

const productService = new ProductService();
const cartService = new CartService();
const ticketService = new TicketService();

export const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID is required",
      });
    }

    const cart = await cartService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    res.json({
      status: "success",
      payload: new CartDTO(cart),
    });
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartService.createCart();

    res.status(201).json({
      status: "success",
      payload: new CartDTO(newCart),
    });
  } catch (error) {
    next(error);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    if (!cid || !pid) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID and Product ID are required",
      });
    }

    // Verificar que el carrito existe
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    // Verificar que el producto existe
    const product = await productService.getProductById(pid);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Verificar que hay stock suficiente
    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: "Insufficient stock",
      });
    }

    const updatedCart = await cartService.addProduct(cid, pid, quantity);

    res.json({
      status: "success",
      payload: new CartDTO(updatedCart),
    });
  } catch (error) {
    next(error);
  }
};

export const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID is required",
      });
    }

    // Verificar que el carrito existe y tiene productos
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Cannot purchase an empty cart",
      });
    }

    // Aquí iría la lógica de compra
    // (verificación de stock, creación de ticket, etc.)

    // Ejemplo simplificado
    const ticket = await ticketService.createTicket({
      amount: cart.products.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
      purchaser: req.user.email,
    });

    await cartService.clearCart(cid);

    res.json({
      status: "success",
      message: "Purchase successful",
      payload: {
        ticket,
      },
    });
  } catch (error) {
    next(error);
  }
};
