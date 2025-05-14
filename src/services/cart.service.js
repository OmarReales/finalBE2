import CartRepository from "../repositories/cart.repository.js";
import CartDAO from "../dao/mongo/cart.dao.js";
export default class CartService {
  constructor() {
    const cartDao = new CartDAO();
    this.cartRepository = new CartRepository();
  }

  async getCartById(cid) {
    return await this.cartRepository.getById(cid);
  }

  async createCart() {
    return await this.cartRepository.create();
  }

  async addProduct(cid, pid, quantity) {
    return await this.cartRepository.addProduct(cid, pid, quantity);
  }

  async updateCart(cid, products) {
    return await this.cartRepository.updateCartProducts(cid, products);
  }

  async clearCart(cid) {
    return await this.cartRepository.clearCart(cid);
  }
}
