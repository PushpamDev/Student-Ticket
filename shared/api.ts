/**
 * Shared types between client and server for the Ticket Raising system
 */

export interface DemoResponse {
  message: string;
}

export type Role = "student" | "admin" | "placement" | "superadmin";

export type TicketCategory =
  | "Infrastructure"
  | "Faculty"
  | "Placement"
  | "Certificate"
  | "Fee";

export type TicketStatus = "Pending" | "Ongoing" | "Resolved";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string; // ISO date
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string; // user id
  authorName: string;
  body: string;
  createdAt: string; // ISO date
}

export interface Ticket {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  branch: string;
  facultyName: string;
  coursePackage: string;
  courseStartDate: string; // ISO date
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}