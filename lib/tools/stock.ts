import { tool } from "ai";
import { z } from "zod";

export const stockTool = tool({
  description: "Get current stock price information for a specific stock symbol",
  parameters: z.object({
    symbol: z.string().describe("The stock symbol (e.g., AAPL, GOOGL, TSLA)"),
  }),
  execute: async ({ symbol }) => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      throw new Error("Alpha Vantage API key not configured");
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol.toUpperCase()}&apikey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch stock data");
      }

      const data = await response.json();
      const quote = data["Global Quote"];

      if (!quote || Object.keys(quote).length === 0) {
        throw new Error("Stock symbol not found or API limit reached");
      }

      return {
        symbol: quote["01. symbol"],
        price: parseFloat(quote["05. price"]),
        change: parseFloat(quote["09. change"]),
        changePercent: quote["10. change percent"],
        high: parseFloat(quote["03. high"]),
        low: parseFloat(quote["04. low"]),
        volume: parseInt(quote["06. volume"]),
        latestTradingDay: quote["07. latest trading day"],
      };
    } catch (error) {
      console.error("Stock API error:", error);
      throw new Error("Unable to fetch stock data for the specified symbol");
    }
  },
});
