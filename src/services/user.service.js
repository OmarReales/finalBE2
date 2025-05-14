import UserRepository from "../repositories/user.repository.js";
import UserDAO from "../dao/mongo/user.dao.js";

export default class UserService {
  constructor() {
    const userDao = new UserDAO();
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return await this.userRepository.getUsers();
  }

  async getUserById(uid) {
    return await this.userRepository.getUserById(uid);
  }

  async saveUser(userData) {
    return await this.userRepository.saveUser(userData);
  }

  async updateUser(uid, userData) {
    return await this.userRepository.updateUser(uid, userData);
  }
}
