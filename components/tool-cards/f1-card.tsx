import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface F1Data {
  raceName: string;
  circuit: string;
  location: string;
  date: string;
  time: string;
  round: string;
  season: string;
  url: string;
}

export function F1Card({ data }: { data: F1Data }) {
  const raceDate = new Date(`${data.date}T${data.time}`);
  const formattedDate = raceDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = raceDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Next F1 Race</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="text-2xl font-bold">{data.raceName}</h3>
          <p className="text-muted-foreground">{data.circuit}</p>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{data.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">{formattedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Round:</span>
            <span className="font-medium">
              {data.round} of {data.season}
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            View Race Details
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
