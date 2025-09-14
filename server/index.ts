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
  app.use("/api/auth", authRouter);
  app.use("/api/tickets", ticketsRouter);
  app.use("/api/messages", messagesRouter);

  return app;
}
