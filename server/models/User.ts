import mongoose from "mongoose";

export type Role = "student" | "admin" | "placement" | "superadmin";
export type Branch = "Faridabad" | "Pune";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  branch?: Branch;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin", "placement", "superadmin"], default: "student" },
  branch: { type: String, enum: ["Faridabad", "Pune"] },
  createdAt: { type: Date, default: () => new Date() },
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);