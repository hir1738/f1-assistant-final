"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { WeatherCard } from "@/components/tool-cards/weather-card";
import { F1Card } from "@/components/tool-cards/f1-card";
import { StockCard } from "@/components/tool-cards/stock-card";
import { signOut } from "next-auth/react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function ChatInterface({ user }: { user: User }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderToolResult = (toolName: string, result: any) => {
    switch (toolName) {
      case "getWeather":
        return <WeatherCard data={result} />;
      case "getF1Matches":
        return <F1Card data={result} />;
      case "getStockPrice":
        return <StockCard data={result} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-semibold">AI Assistant</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <Separator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to AI Assistant
              </h2>
              <p className="text-muted-foreground mb-4">
                I can help you with weather information, F1 race schedules, and
                stock prices.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Weather</p>
                  <p className="text-muted-foreground">
                    "What's the weather in London?"
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">F1 Races</p>
                  <p className="text-muted-foreground">
                    "When is the next F1 race?"
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-2">Stocks</p>
                  <p className="text-muted-foreground">
                    "What's the price of AAPL?"
                  </p>
                </div>
              </div>
            </Card>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}

              <div
                className={`flex flex-col gap-2 max-w-[80%] ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>

                {message.toolInvocations?.map((tool: any) => (
                  <div key={tool.toolCallId}>
                    {tool.state === "result" &&
                      renderToolResult(tool.toolName, tool.result)}
                  </div>
                ))}
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback>
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce delay-100" />
                  <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
