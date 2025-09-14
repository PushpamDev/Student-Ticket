import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { Message } from "../models/Message";
import { Ticket } from "../models/Ticket";

const router = Router();

router.get("/:ticketId", authRequired, async (req, res) => {
  const { ticketId } = req.params;
  const msgs = await Message.find({ ticketId }).sort({ createdAt: 1 });
  res.json({ messages: msgs });
});

router.post("/:ticketId", authRequired, async (req, res) => {
  const { ticketId } = req.params;
  const { body } = req.body;
  if (!body) return res.status(400).json({ message: "Message body required" });
  const t = await Ticket.findById(ticketId);
  if (!t) return res.status(404).json({ message: "Ticket not found" });
  const message = new Message({ ticketId, authorId: req.user.id, authorName: req.user.name, body });
  await message.save();
  res.json({ message });
});

export default router;
