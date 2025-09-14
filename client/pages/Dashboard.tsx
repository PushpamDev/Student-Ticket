import { useAuth } from "@/state/auth";
import * as api from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket } from "@shared/api";
import { TicketCard } from "@/components/app/TicketCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
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
  }, [user]);

  const grouped = useMemo(() => ({
    Pending: tickets.filter((t) => t.status === "Pending"),
    Ongoing: tickets.filter((t) => t.status === "Ongoing"),
    Resolved: tickets.filter((t) => t.status === "Resolved"),
  }), [tickets]);

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Your Tickets</h1>
        <Button asChild><Link to="/tickets/new">Raise new ticket</Link></Button>
      </div>
      <Tabs defaultValue="Pending" className="w-full">
        <TabsList>
          <TabsTrigger value="Pending">Pending ({grouped.Pending.length})</TabsTrigger>
          <TabsTrigger value="Ongoing">Ongoing ({grouped.Ongoing.length})</TabsTrigger>
          <TabsTrigger value="Resolved">Resolved ({grouped.Resolved.length})</TabsTrigger>
        </TabsList>
        {(["Pending", "Ongoing", "Resolved"] as const).map((status) => (
          <TabsContent key={status} value={status} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {grouped[status].length === 0 ? (
              <div className="text-muted-foreground">No {status.toLowerCase()} tickets.</div>
            ) : (
              grouped[status].map((t) => <TicketCard key={t._id || t.id} ticket={t as any} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
