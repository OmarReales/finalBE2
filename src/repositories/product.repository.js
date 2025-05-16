export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getAll(options = {}) {
    return await this.dao.getAll(options);
  }

  async getById(pid) {
    return await this.dao.getById(pid);
  }

  async create(product) {
    return await this.dao.create(product);
  }

  async update(pid, product) {
    return await this.dao.update(pid, product);
  }

  async delete(pid) {
    return await this.dao.delete(pid);
  }

  async updateStock(pid, quantity) {
    const product = await this.dao.getById(pid);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.stock < quantity) {
      throw new Error("Insufficient stock");
    }

    product.stock -= quantity;
    return await this.dao.update(pid, product);
  }

  async checkStock(pid, quantity) {
    const product = await this.dao.getById(pid);
    if (!product) {
      throw new Error("Product not found");
    }

    return product.stock >= quantity;
  }
}
