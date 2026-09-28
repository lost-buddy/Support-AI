
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const { analyzeTicket } = require("../controllers/aiController");

router.post(
  "/:id/analyze",
  authMiddleware,
  roleMiddleware("admin", "agent"),
  analyzeTicket
);

module.exports = router;