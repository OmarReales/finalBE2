import TicketRepository from "../repositories/ticket.repository.js";
import { v4 as uuidv4 } from "uuid";
import TicketDAO from "../dao/mongo/ticket.dao.js";

export default class TicketService {
  constructor() {
    const ticketDao = new TicketDAO();
    this.ticketRepository = new TicketRepository(ticketDao);
  }

  async createTicket(ticketData) {
    const ticket = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: ticketData.amount,
      purchaser: ticketData.purchaser,
    };
    return await this.ticketRepository.create(ticket);
  }

  async getTicketByCode(code) {
    return await this.ticketRepository.getByCode(code);
  }
  async getAllTickets() {
    return await this.ticketRepository.getAll();
  }

  async getTicketsByPurchaser(email) {
    return await this.ticketRepository.getByPurchaser(email);
  }
}
