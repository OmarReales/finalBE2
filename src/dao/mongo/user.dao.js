import userModel from "../models/user.model.js";

export default class UserDAO {
  async getUsers() {
    try {
      let users = await userModel.find();
      return users;
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
