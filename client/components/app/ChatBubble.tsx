import { TicketMessage, User } from "@shared/api";
import { cn } from "@/lib/utils";

export function ChatBubble({ message, currentUser }: { message: TicketMessage; currentUser: User }) {
  const mine = message.authorId === currentUser.id;
  return (
    <div className={cn("flex my-1", mine ? "justify-end" : "justify-start")}> 
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          mine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <div className={cn("font-medium mb-0.5", mine ? "opacity-80" : "text-muted-foreground")}>{message.authorName}</div>
        <div>{message.body}</div>
        <div className={cn("text-[10px] mt-1", mine ? "opacity-80" : "text-muted-foreground")}>{
          new Date(message.createdAt).toLocaleString()
        }</div>
      </div>
    </div>
  );
}
