import ProductService from "../services/product.service.js";
import ProductDTO from "../dto/product.dto.js";
import logger from "../utils/logger.js";

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
  try {
    // Extraer parámetros de query para paginación, ordenamiento y filtrado
    const {
      limit = 10,
      page = 1,
      sort,
      category,
      status,
      minPrice,
      maxPrice,
    } = req.query;

    // Construir objeto de opciones
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? sort.toLowerCase() : null,
      query: {},
    };

    // Aplicar filtros si están presentes
    if (category) {
      options.query.category = category;
    }

    if (status !== undefined) {
      options.query.status = status === "true";
    }

    // Filtros de precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      options.query.price = {};
      if (minPrice !== undefined) {
        options.query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        options.query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Obtener productos paginados
    const result = await productService.getProducts(options);

    // Construir respuesta con formato recomendado por mongoose-paginate-v2
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    logger.info(
      `Fetched products with pagination: page ${page}, limit ${limit}${
        sort ? `, sorted ${sort}` : ""
      }${category ? `, filtered by category ${category}` : ""}`
    );

    const response = {
      status: "success",
      payload: result.docs.map((p) => new ProductDTO(p)),
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${
            sort ? `&sort=${sort}` : ""
          }`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${
            sort ? `&sort=${sort}` : ""
          }`
        : null,
    };
    res.json(response);
  } catch (error) {
    logger.error(`Error fetching products: ${error.message}`, {
      stack: error.stack,
    });
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
    logger.error(`Error updating product ${req.params.pid}: ${error.message}`, {
      stack: error.stack,
    });
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
    logger.error(`Error deleting product ${req.params.pid}: ${error.message}`, {
      stack: error.stack,
    });
    next(error);
  }
};
