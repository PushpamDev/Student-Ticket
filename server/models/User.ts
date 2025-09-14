import mongoose from "mongoose";

export type Role = "student" | "admin" | "placement";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "placement"], default: "student" },
  createdAt: { type: Date, default: () => new Date() },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
