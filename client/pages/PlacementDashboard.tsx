import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Ticket } from "@shared/api";
import { TicketCard } from "@/components/app/TicketCard";
import { Button } from "@/components/ui/button";

export default function PlacementDashboard() {
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
      <h1 className="text-2xl font-bold mb-4">Placement Cell Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.length === 0 ? (
          <div className="text-muted-foreground">No Placement tickets.</div>
        ) : (
          tickets.map((t) => (
            <div key={t._id || (t as any).id} className="space-y-2">
              <TicketCard ticket={t as any} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => markOngoing((t as any)._id || (t as any).id)}>Mark Ongoing</Button>
                <Button onClick={() => markResolved((t as any)._id || (t as any).id)}>Mark Resolved</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
