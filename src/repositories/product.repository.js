export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  async getAll() {
    return await this.dao.getAll();
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
}
