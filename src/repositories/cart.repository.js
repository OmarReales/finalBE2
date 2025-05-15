export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getById(cid) {
    return await this.dao.getById(cid);
  }
  async create() {
    return await this.dao.create();
  }
  async addProduct(cid, pid, quantity = 1) {
    return await this.dao.addProduct(cid, pid, quantity);
  }
  async updateCartProducts(cid, newProducts) {
    return await this.dao.updateCartProducts(cid, newProducts);
  }
  async clearCart(cid) {
    return await this.dao.clearCart(cid);
  }

  async updateProductQuantity(cid, pid, quantity) {
    return await this.dao.updateProductQuantity(cid, pid, quantity);
  }

  async removeProduct(cid, pid) {
    return await this.dao.removeProduct(cid, pid);
  }
}
