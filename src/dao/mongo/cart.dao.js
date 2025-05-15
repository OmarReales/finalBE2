import CartModel from "../models/cart.model.js";

export default class CartDAO {
  async getById(cid) {
    return await CartModel.findById(cid).populate("products.product");
  }

  async create() {
    return await CartModel.create({ products: [] });
  }

  async addProduct(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    const index = cart.products.findIndex((p) => p.product.toString() === pid);

    if (index !== -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    return await cart.save();
  }

  async updateCartProducts(cid, newProducts) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { products: newProducts },
      { new: true }
    );
  }
  async clearCart(cid) {
    return await CartModel.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const index = cart.products.findIndex((p) => p.product.toString() === pid);
    if (index === -1) {
      throw new Error("Product not found in cart");
    }

    cart.products[index].quantity = quantity;
    return await cart.save();
  }

  async removeProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    return await cart.save();
  }
}
