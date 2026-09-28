
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getTicketsForCurrentUser,
  createTicket,
  getMyTickets,
  getTicketById,
  getAllTickets,
  assignTicket,
  updateTicket,
  getAssignedTickets,
  addMessage,
} = require("../controllers/ticketController");

router.get("/", authMiddleware, getTicketsForCurrentUser);
router.post("/", authMiddleware, createTicket);
router.get("/my", authMiddleware, getMyTickets);

// Admin and agent routes
router.get(
  "/all",
  authMiddleware,
  roleMiddleware("admin", "agent"),
  getAllTickets
);

// Agent's assigned tickets
router.get(
  "/assigned",
  authMiddleware,
  roleMiddleware("agent"),
  getAssignedTickets
);

// Admin assigns tickets
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("admin"),
  assignTicket
);

router.post("/:id/messages", authMiddleware, addMessage);

// Admin and agents update tickets
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "agent"),
  updateTicket
);

// Customer ticket details
router.get("/:id", authMiddleware, getTicketById);

module.exports = router;
