import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "@/lib/api";
import { useAuth } from "@/state/auth";
import { Ticket, TicketMessage } from "@shared/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/app/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatBubble } from "@/components/app/ChatBubble";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await api.getTicket(id as string);
        setTicket(t);
        const msgs = await api.fetchMessages(id as string);
        setMessages(msgs);
      } catch (err) {
        setTicket(null);
        setMessages([]);
      }
    })();
  }, [id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canUpdateStatus = useMemo(() => user && (user.role === "admin" || user.role === "placement"), [user]);

  async function send() {
    if (!user || !ticket || !body.trim()) return;
    try {
      await api.postMessage(ticket._id || (ticket as any).id, body.trim());
      const msgs = await api.fetchMessages(ticket._id || (ticket as any).id);
      setMessages(msgs);
      setBody("");
    } catch (err) {
      console.error(err);
    }
  }

  async function onStatusChange(next: Ticket["status"]) {
    if (!ticket) return;
    try {
      const updated = await api.updateTicketApi(ticket._id || (ticket as any).id, { status: next });
      setTicket(updated);
    } catch (err) {
      console.error(err);
    }
  }

  if (!ticket || !user) return <div className="container py-8">Ticket not found.</div>;

  return (
    <div className="container py-8 grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ticket: {ticket.description.slice(0, 60)}</span>
            <StatusBadge status={ticket.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Category: {ticket.category}</div>
            <div>Branch: {ticket.branch}</div>
            <div>Faculty: {ticket.facultyName}</div>
            <div>Course: {ticket.coursePackage}</div>
            <div>Start date: {new Date(ticket.courseStartDate).toLocaleDateString()}</div>
            <div>Raised by: {ticket.studentName} ({ticket.studentEmail})</div>
            <div>Created: {new Date(ticket.createdAt).toLocaleString()}</div>
          </div>
          <hr className="my-4" />
          <div className="h-80 overflow-y-auto pr-1">
            {messages.map((m) => (
              <ChatBubble key={m._id || m.id} message={m as any} currentUser={user} />
            ))}
            <div ref={endRef} />
          </div>
        </CardContent>
        <CardFooter className="flex items-end gap-2">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type your message..." rows={2} />
          <Button onClick={send}>Send</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">Status</div>
          <Select value={ticket.status} onValueChange={(v) => canUpdateStatus && onStatusChange(v as Ticket["status"]) }>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
