import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { ArrowRight, Calendar, Star, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function TicketCard({ ticket }: { ticket: any }) {
  const id = ticket._id || ticket.id;
  const created = ticket.createdAt ? new Date(ticket.createdAt) : undefined;
  return (
    <Card className={cn(
      "hover:shadow-lg transition-shadow",
      ticket.status === "Pending" && "border-pending",
      ticket.status === "Ongoing" && "border-ongoing",
      ticket.status === "Resolved" && "border-resolved",
    )}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{(ticket.description || "").slice(0, 60)}</span>
          <StatusBadge status={ticket.status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Tags className="h-4 w-4" />  
          <span>{ticket.category}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{created ? created.toLocaleString() : ""}</span>
        </div>
        <div className="text-muted-foreground truncate">Branch: {ticket.branch}</div>
        {ticket.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < ticket.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-xs text-muted-foreground">By {ticket.studentName}</div>
        <Button asChild variant="secondary" size="sm">
          <Link to={`/tickets/${id}`}>
            View <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}