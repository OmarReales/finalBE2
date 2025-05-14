import TicketService from "../services/ticket.service.js";
import TicketDTO from "../dto/ticket.dto.js";

const ticketService = new TicketService();

export const getAllTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getAllTickets();

    res.json({
      status: "success",
      payload: tickets.map((t) => new TicketDTO(t)),
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketByCode = async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({
        status: "error",
        message: "Ticket code is required",
      });
    }

    const ticket = await ticketService.getTicketByCode(code);

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "Ticket not found",
      });
    }

    res.json({
      status: "success",
      payload: new TicketDTO(ticket),
    });
  } catch (error) {
    next(error);
  }
};
