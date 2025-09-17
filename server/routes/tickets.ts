import { Router } from "express";
import { authRequired } from "../middleware/auth";
import { Ticket } from "../models/Ticket";

const router = Router();

// Create ticket
router.post("/", authRequired, async (req, res) => {
  const body = req.body;
  const required = ["branch","studentName","studentEmail","facultyName","coursePackage","courseStartDate","description","category"];
  for (const f of required) if (!body[f]) return res.status(400).json({ message: `${f} is required` });
  const ticket = new Ticket({
    studentId: req.user.id,
    studentName: body.studentName,
    studentEmail: body.studentEmail,
    branch: body.branch,
    facultyName: body.facultyName,
    coursePackage: body.coursePackage,
    courseStartDate: new Date(body.courseStartDate),
    description: body.description,
    category: body.category,
  });
  await ticket.save();
  res.json({ ticket });
});

// List tickets - filtered by role
router.get("/", authRequired, async (req, res) => {
  const role = req.user.role as string;
  const userId = req.user.id as string;
  const branch = req.user.branch;

  if (role === "admin") {
    // admin sees all except placement
    const tickets = await Ticket.find({ category: { $in: ["Infrastructure", "Faculty", "Certificate", "Fee"] }, branch }).sort({ createdAt: -1 });
    return res.json({ tickets });
  }
  if (role === "placement") {
    const tickets = await Ticket.find({ category: "Placement", branch }).sort({ createdAt: -1 });
    return res.json({ tickets });
  }
  // student: see own tickets
  const tickets = await Ticket.find({ studentId: userId }).sort({ createdAt: -1 });
  res.json({ tickets });
});

// Get single ticket
router.get("/:id", authRequired, async (req, res) => {
  const t = await Ticket.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json({ ticket: t });
});

// Update ticket (status or feedback)
router.put("/:id", authRequired, async (req, res) => {
  const role = req.user.role as string;
  const userId = req.user.id as string;
  const t = await Ticket.findById(req.params.id);
  if (!t) return res.status(404).json({ message: "Not found" });

  let updated = false;

  // Case 1: Admin/Placement updates status
  if (req.body.status) {
    const allowed = ["admin", "placement"];
    if (!allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden to update status" });
    }
    t.status = req.body.status;
    if (t.status === "Resolved") {
      t.closedBy = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      };
    }
    updated = true;
  }

  // Case 2: Student submits feedback
  if (req.body.feedback) {
    if (role !== 'student' || t.studentId.toString() !== userId) {
        return res.status(403).json({ message: "Forbidden to submit feedback" });
    }
    t.feedback = req.body.feedback;
    updated = true;
  }

  if (updated) {
    await t.save();
    return res.json({ ticket: t });
  }

  res.status(400).json({ message: "No valid fields to update" });
});

// Migration endpoint to bulk import client data (protected)
router.post("/migrate", authRequired, async (req, res) => {
  const { tickets } = req.body;
  if (!tickets || !Array.isArray(tickets)) return res.status(400).json({ message: "No tickets provided" });
  const created: any[] = [];
  for (const tk of tickets) {
    try {
      const ticket = new Ticket({
        studentId: tk.studentId,
        studentName: tk.studentName,
        studentEmail: tk.studentEmail,
        branch: tk.branch,
        facultyName: tk.facultyName,
        coursePackage: tk.coursePackage,
        courseStartDate: new Date(tk.courseStartDate),
        description: tk.description,
        category: tk.category,
        status: tk.status || "Pending",
        createdAt: tk.createdAt ? new Date(tk.createdAt) : undefined,
        updatedAt: tk.updatedAt ? new Date(tk.updatedAt) : undefined,
      });
      await ticket.save();
      created.push(ticket);
    } catch (err) {
      // skip
    }
  }
  res.json({ createdCount: created.length });
});

export default router;