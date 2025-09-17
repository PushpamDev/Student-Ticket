
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rating {
  _id: string;
  name: string;
  email: string;
  avgRating: number;
  count: number;
}

export function RatingCard({ rating }: { rating: Rating }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{rating.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(rating.avgRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                )}
              />
            ))}
          </div>
          <span className="text-muted-foreground ml-2 text-sm">
            ({rating.avgRating.toFixed(1)})
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on {rating.count} ratings
        </p>
      </CardContent>
    </Card>
  );
}