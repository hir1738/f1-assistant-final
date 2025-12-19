import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export function WeatherCard({ data }: { data: WeatherData }) {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {data.location}, {data.country}
          </span>
          <img
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            className="w-12 h-12"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold">{data.temperature}°C</div>
        <p className="text-muted-foreground capitalize">{data.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm pt-2">
          <div>
            <p className="text-muted-foreground">Feels like</p>
            <p className="font-medium">{data.feelsLike}°C</p>
          </div>
          <div>
            <p className="text-muted-foreground">Humidity</p>
            <p className="font-medium">{data.humidity}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Wind Speed</p>
            <p className="font-medium">{data.windSpeed} m/s</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
