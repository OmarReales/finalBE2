import TicketModel from "../models/ticket.model.js";

export default class TicketDAO {
  async create(ticket) {
    return await TicketModel.create(ticket);
  }

  async getByCode(code) {
    return await TicketModel.findOne({ code });
  }
  async getAll() {
    return await TicketModel.find();
  }

  async getByPurchaser(email) {
    return await TicketModel.find({ purchaser: email });
  }
}
