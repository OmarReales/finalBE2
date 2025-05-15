export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async create(ticket) {
    return await this.dao.create(ticket);
  }

  async getByCode(code) {
    return await this.dao.getByCode(code);
  }
  async getAll() {
    return await this.dao.getAll();
  }

  async getByPurchaser(email) {
    return await this.dao.getByPurchaser(email);
  }
}
