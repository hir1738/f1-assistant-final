import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { weatherTool } from "@/lib/tools/weather";
import { f1Tool } from "@/lib/tools/f1";
import { stockTool } from "@/lib/tools/stock";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    tools: {
      getWeather: weatherTool,
      getF1Matches: f1Tool,
      getStockPrice: stockTool,
    },
    system: `You are a helpful AI assistant with access to real-time information.
    You can help users with weather information, Formula 1 race schedules, and stock prices.
    When users ask about these topics, use the appropriate tools to fetch accurate, up-to-date information.
    Be concise and friendly in your responses.`,
  });

  return result.toTextStreamResponse();
}
