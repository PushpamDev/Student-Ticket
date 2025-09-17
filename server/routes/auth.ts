import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Role, Branch } from "../models/User";

const router = Router();

function deriveRoleAndBranch(email: string): { role: Role; branch?: Branch } {
  if (email.toLowerCase() === process.env.SUPERADMIN_EMAIL) {
    return { role: "superadmin" };
  }

  const faridabadAdminList = (process.env.FARIDABAD_ADMIN_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (faridabadAdminList.includes(email.toLowerCase())) {
    return { role: "admin", branch: "Faridabad" };
  }

  const puneAdminList = (process.env.PUNE_ADMIN_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (puneAdminList.includes(email.toLowerCase())) {
    return { role: "admin", branch: "Pune" };
  }

  const faridabadPlacementList = (process.env.FARIDABAD_PLACEMENT_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (faridabadPlacementList.includes(email.toLowerCase())) {
    return { role: "placement", branch: "Faridabad" };
  }

  const punePlacementList = (process.env.PUNE_PLACEMENT_EMAILS || "").split(",").map(s => s.trim()).filter(Boolean);
  if (punePlacementList.includes(email.toLowerCase())) {
    return { role: "placement", branch: "Pune" };
  }

  return { role: "student" };
}

router.post("/register", async (req, res) => {
  const { name, email, password, branch } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ message: "Email already registered" });
  const hashed = await bcrypt.hash(password, 10);
  const { role, branch: derivedBranch } = deriveRoleAndBranch(email.toLowerCase());

  let userBranch = branch;
  if (role !== 'student') {
    userBranch = derivedBranch;
  }

  if (role === 'student' && !branch) {
      return res.status(400).json({ message: "Branch is required for students" });
  }

  const user = new User({ name, email: email.toLowerCase(), password: hashed, role, branch: userBranch });
  await user.save();
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role, branch: user.branch }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, branch: user.branch } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role, branch: user.branch }, process.env.JWT_SECRET as string, { expiresIn: "30d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, branch: user.branch } });
});

router.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(200).json({ user: null });
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await User.findById(decoded.id).select("name email role branch");
    res.json({ user });
  } catch (err) {
    res.status(200).json({ user: null });
  }
});

export default router;