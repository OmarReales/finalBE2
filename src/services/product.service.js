import ProductRepository from "../repositories/product.repository.js";
import ProductDAO from "../dao/mongo/product.dao.js";

export default class ProductService {
  constructor() {
    const productDao = new ProductDAO();
    this.productRepository = new ProductRepository();
  }

  async getProducts() {
    return await this.productRepository.getAll();
  }

  async getProductById(pid) {
    return await this.productRepository.getById(pid);
  }

  async createProduct(product) {
    return await this.productRepository.create(product);
  }

  async updateProduct(pid, product) {
    return await this.productRepository.update(pid, product);
  }

  async deleteProduct(pid) {
    return await this.productRepository.delete(pid);
  }
}
