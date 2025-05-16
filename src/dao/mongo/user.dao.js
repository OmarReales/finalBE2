import userModel from "../models/user.model.js";

export default class UserDAO {
  async getUsers(options = {}) {
    try {
      const { limit = 10, page = 1, sort = null, query = {} } = options;

      // Configuración para ordenamiento
      const sortOptions = {};
      if (sort) {
        sortOptions.last_name = sort === "asc" ? 1 : -1;
      }

      // Ejecutar paginación
      let result = await userModel.paginate(query, {
        limit,
        page,
        sort: sortOptions,
        lean: true,
        // Excluir campo de contraseña en la consulta
        select: "-password",
      });

      return result;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  }

  async getUserById(id) {
    try {
      let user = await userModel.findOne({ _id: id });
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  }

  async saveUser(user) {
    try {
      let newUser = await userModel.create(user);
      return newUser;
    } catch (error) {
      console.error("Error saving user:", error);
      return null;
    }
  }

  async updateUser(id, user) {
    try {
      let updatedUser = await userModel.updateOne({ _id: id }, { $set: user });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }
}
