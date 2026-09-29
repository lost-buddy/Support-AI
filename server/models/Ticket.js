
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body: { type: String, required: true, trim: true, maxlength: 5000 },
  createdAt: { type: Date, default: Date.now },
});

const statusEventSchema = new mongoose.Schema({
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Payment",
        "Technical",
        "Account",
        "Delivery",
        "Other",
      ],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Neutral", "Negative"],
      default: "Neutral",
    },
    aiSummary: {
      type: String,
      default: "",
    },
    aiSuggestedResponse: {
      type: String,
      default: "",
    },
    messages: { type: [messageSchema], default: [] },
    statusHistory: { type: [statusEventSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
