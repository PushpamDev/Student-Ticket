
import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { Ticket } from "../models/Ticket";

const router = Router();

// Get all tickets for super admin
router.get("/tickets", authRequired, async (req, res) => {
  const user = req.user;
  if (user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const tickets = await Ticket.find().sort({ createdAt: -1 });
  const ticketsWithRating = tickets.map(ticket => ({
    ...ticket.toObject(),
    rating: ticket.feedback?.rating,
  }));
  res.json({ tickets: ticketsWithRating });
});

// Get ratings for super admin
router.get("/ratings", authRequired, async (req, res) => {
  const user = req.user;
  if (user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const ratings = await Ticket.aggregate([
    {
      $match: {
        feedback: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: "$closedBy.id",
        name: { $first: "$closedBy.name" },
        email: { $first: "$closedBy.email" },
        avgRating: { $avg: "$feedback.rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({ ratings });
});

// Get all tickets for a specific admin
router.get("/ratings/:adminId/tickets", authRequired, async (req, res) => {
  const user = req.user;
  if (user.role !== "superadmin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { adminId } = req.params;
  const tickets = await Ticket.find({ "closedBy.id": adminId }).sort({ createdAt: -1 });
  const ticketsWithRating = tickets.map(ticket => ({
    ...ticket.toObject(),
    rating: ticket.feedback?.rating,
  }));
  res.json({ tickets: ticketsWithRating });
});

export default router;