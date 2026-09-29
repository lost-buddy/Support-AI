
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const { ensureAdminAccount } = require("./services/bootstrapService");

const app = express();

// Middleware
const configuredOrigins = process.env.CLIENT_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const allowedOrigins = configuredOrigins?.length
  ? configuredOrigins
  : process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173"];
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header (for example, health probes) are not browser CORS requests.
    return callback(null, !origin || allowedOrigins.includes(origin));
  },
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("AI Customer Support API is running!");
});

app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({ status: databaseReady ? "ok" : "starting", database: databaseReady ? "connected" : "disconnected" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error("API error:", error.message);
  res.status(500).json({ message: "Internal server error" });
});

async function startServer() {
  if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
    throw new Error("CLIENT_ORIGIN is required in production. Set it to the deployed frontend origin (for example, https://your-app.vercel.app).");
  }
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is required in server/.env");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required in server/.env");
  if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  await ensureAdminAccount();

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`SupportAI API listening on port ${port}`));
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exitCode = 1;
});
