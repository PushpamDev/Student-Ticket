import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@shared/api";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const appearance =
    status === "Resolved"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : status === "Ongoing"
        ? "bg-amber-100 text-amber-700 border-amber-200"
        : "bg-slate-100 text-slate-700 border-slate-200";
  return <Badge className={appearance}>{status}</Badge>;
}
