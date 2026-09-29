import api from "./axios";

export const normalizeTicket = (ticket) => ({
  ...ticket,
  id: String(ticket._id || ticket.id),
  customer: ticket.customer?.name || ticket.customer || "",
  customerEmail: ticket.customer?.email || "",
  date: ticket.createdAt
    ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(ticket.createdAt))
    : ticket.date || "",
  summary: ticket.aiSummary || ticket.summary || "",
  response: ticket.aiSuggestedResponse || ticket.response || "",
  messages: (ticket.messages || []).map((message) => ({
    ...message,
    id: String(message._id || message.id),
    authorName: message.author?.name || "Support",
    authorRole: message.author?.role || "agent",
    body: message.body || "",
  })),
  statusHistory: (ticket.statusHistory || []).map((event) => ({
    ...event,
    id: String(event._id || `${ticket._id || ticket.id}-${event.createdAt}-${event.status}`),
    changedByName: event.changedBy?.name || "Support team",
    changedByRole: event.changedBy?.role || "agent",
  })),
});

export const getTickets = async () => {
  const response = await api.get("/tickets");
  return response.data.map(normalizeTicket);
};

export const createTicket = async (ticketData) => {
  const response = await api.post("/tickets", ticketData);
  return normalizeTicket(response.data.ticket);
};

export const updateTicket = async (ticketId, updates) => {
  const response = await api.patch(`/tickets/${ticketId}`, updates);
  return normalizeTicket(response.data.ticket);
};

export const addTicketMessage = async (ticketId, body) => {
  const response = await api.post(`/tickets/${ticketId}/messages`, { body });
  return normalizeTicket(response.data.ticket);
};

export const analyzeTicket = async (ticketId) => {
  const response = await api.post(`/ai/${ticketId}/analyze`);
  return normalizeTicket(response.data.ticket);
};
