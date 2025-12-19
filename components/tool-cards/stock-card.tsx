import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  high: number;
  low: number;
  volume: number;
  latestTradingDay: string;
}

export function StockCard({ data }: { data: StockData }) {
  const isPositive = data.change >= 0;

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{data.symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-3xl font-bold">${data.price.toFixed(2)}</div>
          <div
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "+" : ""}
            {data.change.toFixed(2)} ({data.changePercent})
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">High</p>
            <p className="font-medium">${data.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Low</p>
            <p className="font-medium">${data.low.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="font-medium">{data.volume.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">{data.latestTradingDay}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
