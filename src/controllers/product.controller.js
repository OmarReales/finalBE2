import ProductService from "../services/product.service.js";
import ProductDTO from "../dto/product.dto.js";

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.json({
      status: "success",
      payload: products.map((p) => new ProductDTO(p)),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({
        status: "error",
        message: "Product ID is required",
      });
    }

    const product = await productService.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      payload: new ProductDTO(product),
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, code, stock } = req.body;

    // Validación básica
    if (!title || !description || !price || !code || !stock) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    const product = await productService.createProduct(req.body);

    res.status(201).json({
      status: "success",
      payload: new ProductDTO(product),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({
        status: "error",
        message: "Product ID is required",
      });
    }

    const productExists = await productService.getProductById(pid);

    if (!productExists) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    const updatedProduct = await productService.updateProduct(pid, req.body);

    res.json({
      status: "success",
      payload: new ProductDTO(updatedProduct),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;

    if (!pid) {
      return res.status(400).json({
        status: "error",
        message: "Product ID is required",
      });
    }

    const productExists = await productService.getProductById(pid);

    if (!productExists) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    await productService.deleteProduct(pid);

    res.json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
