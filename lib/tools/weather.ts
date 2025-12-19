import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
  description: "Get current weather information for a specific location",
  parameters: z.object({
    location: z.string().describe("The city name or location to get weather for"),
  }),
  execute: async ({ location }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("OpenWeather API key not configured");
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      return {
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
      };
    } catch (error) {
      console.error("Weather API error:", error);
      throw new Error("Unable to fetch weather data for the specified location");
    }
  },
});
