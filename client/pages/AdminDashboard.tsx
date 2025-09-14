import { useEffect, useMemo, useState } from "react";
import * as api from "@/lib/api";
import { Ticket } from "@shared/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketCard } from "@/components/app/TicketCard";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.fetchTickets();
        setTickets(list);
      } catch (err) {
        setTickets([]);
      }
    })();
  }, []);

  const byCategory = useMemo(() => ({
    Infrastructure: tickets.filter((t) => t.category === "Infrastructure"),
    Faculty: tickets.filter((t) => t.category === "Faculty"),
    Certificate: tickets.filter((t) => t.category === "Certificate"),
    Fee: tickets.filter((t) => t.category === "Fee"),
  }), [tickets]);

  async function markOngoing(id: string) {
    try {
      const updated = await api.updateTicketApi(id, { status: "Ongoing" });
      setTickets((prev) => prev.map((t) => (t._id === id || (t as any).id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  }

  async function markResolved(id: string) {
    try {
      const updated = await api.updateTicketApi(id, { status: "Resolved" });
      setTickets((prev) => prev.map((t) => (t._id === id || (t as any).id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Tabs defaultValue="Infrastructure">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="Infrastructure">Infrastructure ({byCategory.Infrastructure.length})</TabsTrigger>
          <TabsTrigger value="Faculty">Faculty ({byCategory.Faculty.length})</TabsTrigger>
          <TabsTrigger value="Certificate">Certificate ({byCategory.Certificate.length})</TabsTrigger>
          <TabsTrigger value="Fee">Fee ({byCategory.Fee.length})</TabsTrigger>
        </TabsList>
        {(["Infrastructure", "Faculty", "Certificate", "Fee"] as const).map((cat) => (
          <TabsContent key={cat} value={cat} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {byCategory[cat].length === 0 ? (
              <div className="text-muted-foreground">No {cat} tickets.</div>
            ) : (
              byCategory[cat].map((t) => (
                <div key={t._id || (t as any).id} className="space-y-2">
                  <TicketCard ticket={t as any} />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => markOngoing((t as any)._id || (t as any).id)}>Mark Ongoing</Button>
                    <Button onClick={() => markResolved((t as any)._id || (t as any).id)}>Mark Resolved</Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
