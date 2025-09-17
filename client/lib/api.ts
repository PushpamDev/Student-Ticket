const TOKEN_KEY = "app.token.v1";

function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`/api${path}`, { headers: { ...headers, ...(options.headers as Record<string, string> || {}) }, ...options });
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const err = (body && body.message) || res.statusText || 'Request error';
    throw new Error(err);
  }
  return body;
}

export async function register(name: string, email: string, password: string, branch?: "Faridabad" | "Pune") {
  const body = await request(`/auth/register`, { method: "POST", body: JSON.stringify({ name, email, password, branch }) });
  if (body.token) setToken(body.token);
  return body;
}

export async function login(email: string, password: string) {
  const body = await request(`/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) });
  if (body.token) setToken(body.token);
  return body;
}

export async function me() {
  try {
    const body = await request(`/auth/me`);
    return body.user || null;
  } catch {
    return null;
  }
}

export async function logout() {
  setToken(null);
}

export async function fetchTickets() {
  const body = await request(`/tickets`);
  return body.tickets || [];
}

export async function createTicket(payload: any) {
  const body = await request(`/tickets`, { method: "POST", body: JSON.stringify(payload) });
  return body.ticket;
}

export async function getTicket(id: string) {
  const body = await request(`/tickets/${id}`);
  return body.ticket;
}

export async function updateTicketApi(id: string, patch: any) {
  const body = await request(`/tickets/${id}`, { method: "PUT", body: JSON.stringify(patch) });
  return body.ticket;
}

export async function fetchMessages(ticketId: string) {
  const body = await request(`/messages/${ticketId}`);
  return body.messages || [];
}

export async function postMessage(ticketId: string, message: string) {
  const body = await request(`/messages/${ticketId}`, { method: "POST", body: JSON.stringify({ body: message }) });
  return body.message;
}

export async function getSuperAdminTickets() {
  const body = await request(`/superadmin/tickets`);
  return body.tickets || [];
}

export async function getSuperAdminRatings() {
  const body = await request(`/superadmin/ratings`);
  return body.ratings || [];
}

export async function getTicketsForAdmin(adminId: string) {
  const body = await request(`/superadmin/ratings/${adminId}/tickets`);
  return body.tickets || [];
}

export function getStoredToken() { return getToken(); }
export function setStoredToken(t: string | null) { setToken(t); }

export default { register, login, me, logout, fetchTickets, createTicket, getTicket, updateTicketApi, fetchMessages, postMessage, getSuperAdminTickets, getSuperAdminRatings, getTicketsForAdmin, getStoredToken, setStoredToken };