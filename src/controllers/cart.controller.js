import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
import TicketService from "../services/ticket.service.js";
import CartDTO from "../dto/cart.dto.js";
import logger from "../utils/logger.js";

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
    const userId = req.user?.id || "unknown";
    const userEmail = req.user?.email || "unknown";

    // Validación de usuario
    if (!req.user || !req.user.email) {
      logger.warn(`Unauthorized purchase attempt for cart ${cid}`);
      return res.status(401).json({
        status: "error",
        message: "User authentication required for purchase",
      });
    }

    if (!cid) {
      logger.warn(`Missing cart ID in purchase request by user ${userId}`);
      return res.status(400).json({
        status: "error",
        message: "Cart ID is required",
      });
    }

    logger.info(`Starting purchase process for cart ${cid} by user ${userId}`);
    // Verificar que el carrito existe
    const cart = await cartService.getCartById(cid);
    if (!cart) {
      logger.warn(`Cart ${cid} not found during purchase by user ${userId}`);
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    if (!cart.products || cart.products.length === 0) {
      logger.warn(`Attempted purchase of empty cart ${cid} by user ${userId}`);
      return res.status(400).json({
        status: "error",
        message: "Cannot purchase an empty cart",
      });
    }
    // Verificar que el carrito no esté vacío
    const successfulProducts = [];
    const failedProducts = [];
    let totalAmount = 0;

    logger.info(`Processing ${cart.products.length} products in cart ${cid}`);

    // Procesar cada producto
    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      try {
        // Verificar stock utilizando el método especializado
        const hasStock = await productService.checkStock(product._id, quantity);

        if (hasStock) {
          // Actualizar stock con método especializado
          await productService.updateStock(product._id, quantity);

          // Añadir a productos exitosos
          successfulProducts.push({
            product: product._id,
            quantity,
            price: product.price,
            subtotal: product.price * quantity,
          });

          // Actualizar monto total
          totalAmount += product.price * quantity;

          logger.debug(
            `Product ${product._id} processed successfully (${quantity} units, $${product.price} each)`
          );
        } else {
          // Añadir a productos fallidos
          failedProducts.push({
            product: product._id,
            quantity,
            reason: "Insufficient stock",
          });

          logger.debug(
            `Insufficient stock for product ${product._id} (requested: ${quantity})`
          );
        }
      } catch (error) {
        // Manejar errores específicos de cada producto
        failedProducts.push({
          product: product._id,
          quantity,
          reason: `Error processing: ${error.message}`,
        });

        logger.error(
          `Error processing product ${product._id}: ${error.message}`
        );
      }
    }

    // Crear ticket solo si hay productos exitosos
    let ticket = null;
    if (successfulProducts.length > 0) {
      ticket = await ticketService.createTicket({
        amount: totalAmount,
        purchaser: userEmail,
      });

      logger.info(
        `Ticket created successfully: ${ticket.code} for $${totalAmount} by user ${userEmail}`
      );
    } else {
      logger.warn(`No products were successfully purchased by user ${userId}`);
    }

    // Convertir los productos fallidos al formato esperado por el modelo de carrito
    const failedCartProducts = failedProducts.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    // Actualizar carrito para que solo contenga productos fallidos
    const updatedCart = await cartService.updateCart(cid, failedCartProducts);

    logger.info(
      `Purchase process completed for cart ${cid}. Success: ${successfulProducts.length}, Failed: ${failedProducts.length}`
    );

    // Respuesta con información detallada
    return res.status(200).json({
      status: "success",
      message:
        successfulProducts.length > 0
          ? "Purchase completed with some or all products"
          : "No products could be purchased",
      payload: {
        ticket,
        purchaseSummary: {
          totalAmount,
          successfulProducts: successfulProducts.length,
          failedProducts: failedProducts.length,
        },
        successfulProducts,
        failedProducts,
        updatedCart: new CartDTO(updatedCart),
      },
    });
  } catch (error) {
    logger.error(`Error in purchase process: ${error.message}`, {
      stack: error.stack,
    });
    next(error);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!cid || !pid) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID and Product ID are required",
      });
    }

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Quantity must be a positive number",
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

    const updatedCart = await cartService.updateProductQuantity(
      cid,
      pid,
      quantity
    );

    res.json({
      status: "success",
      message: "Product quantity updated successfully",
      payload: new CartDTO(updatedCart),
    });
  } catch (error) {
    next(error);
  }
};

export const removeProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

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

    const updatedCart = await cartService.removeProduct(cid, pid);

    res.json({
      status: "success",
      message: "Product removed from cart successfully",
      payload: new CartDTO(updatedCart),
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const { cid } = req.params;

    if (!cid) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID is required",
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

    const updatedCart = await cartService.clearCart(cid);

    res.json({
      status: "success",
      message: "Cart cleared successfully",
      payload: new CartDTO(updatedCart),
    });
  } catch (error) {
    next(error);
  }
};
