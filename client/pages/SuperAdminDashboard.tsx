
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Ticket } from "@shared/api";
import { TicketList } from "@/components/app/TicketList";
import { RatingCard } from "@/components/app/RatingCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Rating {
  _id: string;
  name: string;
  email: string;
  avgRating: number;
  count: number;
}

const SuperAdminDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<Rating | null>(null);
  const [adminTickets, setAdminTickets] = useState<Ticket[]>([]);
  const [loadingAdminTickets, setLoadingAdminTickets] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getSuperAdminTickets(),
      api.getSuperAdminRatings(),
    ]).then(([tickets, ratings]) => {
      setTickets(tickets);
      setRatings(ratings);
      setLoading(false);
    });
  }, []);

  const handleRatingCardClick = async (admin: Rating) => {
    setSelectedAdmin(admin);
    setLoadingAdminTickets(true);
    const tickets = await api.getTicketsForAdmin(admin._id);
    setAdminTickets(tickets);
    setLoadingAdminTickets(false);
  };

  const handleBackClick = () => {
    setSelectedAdmin(null);
    setAdminTickets([]);
  };

  const faridabadTickets = tickets.filter((ticket) => ticket.branch === "Faridabad");
  const puneTickets = tickets.filter((ticket) => ticket.branch === "Pune");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />)}
            </div>
          ) : (
            <Tabs defaultValue="faridabad">
              <TabsList>
                <TabsTrigger value="faridabad">Faridabad</TabsTrigger>
                <TabsTrigger value="pune">Pune</TabsTrigger>
              </TabsList>
              <TabsContent value="faridabad">
                <TicketList tickets={faridabadTickets} />
              </TabsContent>
              <TabsContent value="pune">
                <TicketList tickets={puneTickets} />
              </TabsContent>
            </Tabs>
          )}
        </TabsContent>
        <TabsContent value="ratings">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
          ) : selectedAdmin ? (
            <div>
              <button onClick={handleBackClick} className="mb-4">Back to Ratings</button>
              <h2 className="text-xl font-bold mb-4">Tickets Resolved by {selectedAdmin.name}</h2>
              {loadingAdminTickets ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40" />)}
                </div>
              ) : (
                <TicketList tickets={adminTickets} />
              )}
            </div>
          ) : ratings.length === 0 ? (
            <p className="text-muted-foreground">No ratings to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ratings.map((rating) => (
                <div key={rating._id} onClick={() => handleRatingCardClick(rating)}>
                  {/* @ts-expect-error - rating is not fully typed */}
                  <RatingCard rating={rating} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDashboard;