import { Ticket, TicketMessage, User } from "@shared/api";

const USERS_KEY = "app.users.v1";
const CURRENT_USER_KEY = "app.currentUser.v1";
const TICKETS_KEY = "app.tickets.v1";
const MESSAGES_KEY = "app.messages.v1";

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function deriveRoleFromEmail(email: string): User["role"] {
  const e = email.toLowerCase();
  if (e.endsWith("@admin.edu") || e.startsWith("admin@")) return "admin";
  if (e.endsWith("@placement.edu") || e.startsWith("placement@")) return "placement";
  return "student";
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Users
export function getUsers(): User[] {
  return readJSON<User[]>(USERS_KEY, []);
}

export function saveUsers(users: User[]) {
  writeJSON(USERS_KEY, users);
}

export function getCurrentUser(): User | null {
  return readJSON<User | null>(CURRENT_USER_KEY, null);
}

export function setCurrentUser(user: User | null) {
  writeJSON(CURRENT_USER_KEY, user);
}

export function registerUser(name: string, email: string): User {
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const now = new Date().toISOString();
  const newUser: User = {
    id: uuid(),
    name,
    email,
    role: deriveRoleFromEmail(email),
    createdAt: now,
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return newUser;
}

export function loginUser(email: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) setCurrentUser(user);
  return user ?? null;
}

export function logoutUser() {
  setCurrentUser(null);
}

// Tickets
export function getTickets(): Ticket[] {
  return readJSON<Ticket[]>(TICKETS_KEY, []);
}

export function saveTickets(tickets: Ticket[]) {
  writeJSON(TICKETS_KEY, tickets);
}

export function createTicket(input: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status"> & { status?: Ticket["status"] }): Ticket {
  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: uuid(),
    createdAt: now,
    updatedAt: now,
    status: input.status ?? "Pending",
    ...input,
  };
  const tickets = getTickets();
  tickets.unshift(ticket);
  saveTickets(tickets);
  return ticket;
}

export function updateTicket(id: string, patch: Partial<Ticket>): Ticket | null {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  const updated: Ticket = { ...tickets[idx], ...patch, updatedAt: new Date().toISOString() };
  tickets[idx] = updated;
  saveTickets(tickets);
  return updated;
}

// Messages
export function getMessages(): TicketMessage[] {
  return readJSON<TicketMessage[]>(MESSAGES_KEY, []);
}

export function saveMessages(messages: TicketMessage[]) {
  writeJSON(MESSAGES_KEY, messages);
}

export function getMessagesByTicket(ticketId: string): TicketMessage[] {
  return getMessages().filter((m) => m.ticketId === ticketId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function addMessage(ticketId: string, author: User, body: string): TicketMessage {
  const now = new Date().toISOString();
  const message: TicketMessage = {
    id: uuid(),
    ticketId,
    authorId: author.id,
    authorName: author.name,
    body,
    createdAt: now,
  };
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
  return message;
}
