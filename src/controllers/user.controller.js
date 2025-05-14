import UserService from "../services/user.service.js";
import UserDTO from "../dto/user.dto.js";

const userService = new UserService();

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();

    res.json({
      status: "success",
      payload: users.map((u) => new UserDTO(u)),
    });
  } catch (error) {
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
