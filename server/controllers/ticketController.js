const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const User = require("../models/User");

const ticketPopulation = [
  { path: "customer", select: "name email role" },
  { path: "assignedAgent", select: "name email role" },
  { path: "messages.author", select: "name role" },
];

function isStaff(user) {
  return ["admin", "agent"].includes(user.role);
}

async function findAccessibleTicket(id, user) {
  if (!mongoose.isValidObjectId(id)) return null;
  const query = { _id: id };
  if (!isStaff(user)) query.customer = user.id;
  return Ticket.findOne(query).populate(ticketPopulation);
}

exports.getTicketsForCurrentUser = async (req, res) => {
  try {
    const query = isStaff(req.user) ? {} : { customer: req.user.id };
    const tickets = await Ticket.find(query).populate(ticketPopulation).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("List tickets failed:", error.message);
    res.status(500).json({ message: "Could not load tickets" });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority } = req.body;
    if (!subject?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Subject and description are required" });
    }

    const ticket = await Ticket.create({
      subject: subject.trim(),
      description: description.trim(),
      category,
      priority,
      customer: req.user.id,
    });
    await ticket.populate(ticketPopulation);
    res.status(201).json({ message: "Ticket created", ticket });
  } catch (error) {
    console.error("Create ticket failed:", error.message);
    res.status(500).json({ message: "Could not create ticket" });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user.id }).populate(ticketPopulation).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Load customer tickets failed:", error.message);
    res.status(500).json({ message: "Could not load tickets" });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await findAccessibleTicket(req.params.id, req.user);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    console.error("Load ticket failed:", error.message);
    res.status(500).json({ message: "Could not load ticket" });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate(ticketPopulation).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Load all tickets failed:", error.message);
    res.status(500).json({ message: "Could not load tickets" });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(agentId)) {
      return res.status(400).json({ message: "A valid ticket and agent are required" });
    }

    const agent = await User.findOne({ _id: agentId, role: "agent" });
    if (!agent) return res.status(404).json({ message: "Support agent not found" });

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agent._id, status: "In Progress" },
      { new: true, runValidators: true }
    ).populate(ticketPopulation);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket assigned", ticket });
  } catch (error) {
    console.error("Assign ticket failed:", error.message);
    res.status(500).json({ message: "Could not assign ticket" });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const updates = {};
    for (const field of ["status", "priority"]) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Provide a status or priority to update" });
    }

    const ticket = await Ticket.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate(ticketPopulation);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket updated", ticket });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ message: "Invalid ticket update" });
    console.error("Update ticket failed:", error.message);
    res.status(500).json({ message: "Could not update ticket" });
  }
};

exports.getAssignedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ assignedAgent: req.user.id }).populate(ticketPopulation).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Load assigned tickets failed:", error.message);
    res.status(500).json({ message: "Could not load assigned tickets" });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const body = req.body.body?.trim();
    if (!body) return res.status(400).json({ message: "Message text is required" });
    if (body.length > 5000) return res.status(400).json({ message: "Message must be 5000 characters or fewer" });

    const ticket = await findAccessibleTicket(req.params.id, req.user);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    ticket.messages.push({ author: req.user.id, body });
    if (ticket.status === "Open" && isStaff(req.user)) ticket.status = "In Progress";
    await ticket.save();
    await ticket.populate("messages.author", "name role");
    res.status(201).json({ message: "Reply saved", ticket });
  } catch (error) {
    console.error("Save reply failed:", error.message);
    res.status(500).json({ message: "Could not save reply" });
  }
};
