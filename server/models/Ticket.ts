import mongoose from "mongoose";

export type TicketStatus = "Pending" | "Ongoing" | "Resolved";
export type TicketCategory = "Infrastructure" | "Faculty" | "Placement" | "Certificate" | "Fee";

export interface ITicket extends mongoose.Document {
  studentId: string;
  studentName: string;
  studentEmail: string;
  branch: string;
  facultyName: string;
  coursePackage: string;
  courseStartDate: Date;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  feedback?: {
    rating: number;
    text: string;
  };
  closedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

const TicketSchema = new mongoose.Schema<ITicket>({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  branch: { type: String, required: true },
  facultyName: { type: String, required: true },
  coursePackage: { type: String, required: true },
  courseStartDate: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Infrastructure", "Faculty", "Placement", "Certificate", "Fee"], required: true },
  status: { type: String, enum: ["Pending", "Ongoing", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
  feedback: {
    type: {
      rating: { type: Number, required: true },
      text: { type: String, required: true },
    },
    required: false,
  },
  closedBy: {
    type: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    required: false,
  },
});

TicketSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);