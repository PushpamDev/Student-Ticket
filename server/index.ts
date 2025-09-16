import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDB } from "./db";
import authRouter from "./routes/auth";
import ticketsRouter from "./routes/tickets";
import messagesRouter from "./routes/messages";

// Attempt to connect to DB on startup (non-blocking here)
connectDB().catch((err) => {
  console.error("Mongo connection error:", err.message || err);
});

export function createServer() {
  const app = express();

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

    app.get("/api/demo", handleDemo);

  // Auth and app routes
  try {
    app.use("/api/auth", authRouter);
  } catch (e) {
    console.error("Error mounting auth router:", e);
  }

  try {
    app.use("/api/tickets", ticketsRouter);
  } catch (e) {
    console.error("Error mounting tickets router:", e);
  }

  try {
    app.use("/api/messages", messagesRouter);
  } catch (e) {
    console.error("Error mounting messages router:", e);
  }

  return app;
}