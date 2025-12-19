import { tool } from "ai";
import { z } from "zod";

export const f1Tool = tool({
  description: "Get information about the next Formula 1 race",
  parameters: z.object({}),
  execute: async () => {
    try {
      const response = await fetch("http://ergast.com/api/f1/current/next.json");

      if (!response.ok) {
        throw new Error("Failed to fetch F1 data");
      }

      const data = await response.json();
      const race = data.MRData.RaceTable.Races[0];

      if (!race) {
        throw new Error("No upcoming race found");
      }

      return {
        raceName: race.raceName,
        circuit: race.Circuit.circuitName,
        location: `${race.Circuit.Location.locality}, ${race.Circuit.Location.country}`,
        date: race.date,
        time: race.time,
        round: race.round,
        season: race.season,
        url: race.url,
      };
    } catch (error) {
      console.error("F1 API error:", error);
      throw new Error("Unable to fetch F1 race data");
    }
  },
});
