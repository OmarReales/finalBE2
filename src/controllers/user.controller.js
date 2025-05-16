import UserService from "../services/user.service.js";
import UserDTO from "../dto/user.dto.js";
import logger from "../utils/logger.js";

const userService = new UserService();

export const getUsers = async (req, res, next) => {
  try {
    // Extraer parámetros de paginación y ordenamiento
    const { limit = 10, page = 1, sort, role } = req.query;

    // Construir objeto de opciones
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? sort.toLowerCase() : null,
      query: {},
    };

    // Aplicar filtro por rol si se proporciona
    if (role) {
      options.query.role = role;
    }

    logger.info(
      `Fetching users with pagination: page ${page}, limit ${limit}${
        sort ? `, sorted ${sort}` : ""
      }${role ? `, filtered by role ${role}` : ""}`
    );

    // Obtener usuarios paginados
    const result = await userService.getUsers(options);

    // Construir respuesta con formato para paginación
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;

    const response = {
      status: "success",
      payload: result.docs.map((u) => new UserDTO(u)),
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${
            sort ? `&sort=${sort}` : ""
          }${role ? `&role=${role}` : ""}`
        : null,
      nextLink: result.hasNextPage
        ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${
            sort ? `&sort=${sort}` : ""
          }${role ? `&role=${role}` : ""}`
        : null,
    };

    res.json(response);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`, {
      stack: error.stack,
    });
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { uid } = req.params;

    if (!uid) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    const user = await userService.getUserById(uid);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      payload: new UserDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

export const saveUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validación básica
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    const user = await userService.saveUser(req.body);

    res.status(201).json({
      status: "success",
      payload: new UserDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    const user = await userService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: "success",
      payload: new UserDTO(user),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    // Validar que el user ID existe
    if (!uid) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    // Verificar que el usuario existe
    const existingUser = await userService.getUserById(uid);
    if (!existingUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // No permitir actualizar contraseña por esta vía
    if (updateData.password) {
      delete updateData.password;
    }

    // No permitir cambiar el rol por esta vía
    if (updateData.role) {
      delete updateData.role;
    }

    // No permitir actualizar el email para evitar conflictos
    if (updateData.email) {
      delete updateData.email;
    }

    const updatedUser = await userService.updateUser(uid, updateData);

    res.json({
      status: "success",
      message: "User updated successfully",
      payload: new UserDTO(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};
