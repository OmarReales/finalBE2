import ProductModel from "../models/product.model.js";

export default class ProductDAO {
  async getAll(options = {}) {
    const { limit = 10, page = 1, sort = null, query = {} } = options;

    const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : {};

    return await ProductModel.paginate(query, {
      limit,
      page,
      sort: sortOptions,
      lean: true,
    });
  }

  async getById(pid) {
    return await ProductModel.findById(pid);
  }

  async create(product) {
    return await ProductModel.create(product);
  }

  async update(pid, product) {
    return await ProductModel.findByIdAndUpdate(pid, product, { new: true });
  }

  async delete(pid) {
    return await ProductModel.findByIdAndDelete(pid);
  }
}
