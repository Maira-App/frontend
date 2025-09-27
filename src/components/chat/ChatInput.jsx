import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvokeLLM } from "@/integrations/Core";
import { Client, Activity as ActivityEntity } from "@/entities/all";
import { format } from "date-fns";

export default function ChatInput() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Expand the interface when first message is sent
    if (messages.length === 0) {
      setIsExpanded(true);
    }

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get context data for MAIRA
      const [clientsData, activitiesData] = await Promise.all([
        Client.getAll({ limit: 10 }),
        ActivityEntity.getAll({ limit: 20 }),
      ]);

      // Prepare context for the AI
      const context = {
        recent_clients: clientsData.slice(0, 5).map((c) => ({
          name: c.full_name,
          status: c.status,
          urgency: c.urgency_level,
          property_type: c.property_type,
          last_interaction: c.last_interaction,
        })),
        recent_activities: activitiesData.slice(0, 10).map((a) => ({
          type: a.action_type,
          title: a.title,
          status: a.completion_status,
          date: a.created_date,
        })),
        current_date: new Date().toISOString(),
      };

      const response = await InvokeLLM({
        prompt: `You are MAIRA, an intelligent real estate assistant. You help real estate agents manage their business efficiently.

Current context:
- Recent clients: ${JSON.stringify(context.recent_clients)}
- Recent activities: ${JSON.stringify(context.recent_activities)}
- Current date: ${context.current_date}

User question: "${userMessage.text}"

Please provide a helpful, concise response as MAIRA. Be professional but friendly. If the question is about specific clients or activities, reference the context data. If you need more information, ask clarifying questions. Keep responses under 200 words.`,
        add_context_from_internet: false,
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.response || response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting MAIRA response:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Show me my urgent clients",
    "What's on my schedule today?",
    "Recent activity summary",
    "Market insights",
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="mb-6 sm:mb-8">
      {/* Chat Messages - Only show when expanded */}
      {isExpanded && messages.length > 0 && (
        <div className="bg-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-800 mb-4 max-h-64 sm:max-h-96 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                    message.isBot
                      ? message.isError
                        ? "bg-red-500/20 text-red-200 border border-red-500/30"
                        : "bg-gray-800 text-gray-100 border border-gray-700"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.isBot ? "text-gray-400" : "text-white/70"
                    }`}
                  >
                    {format(message.timestamp, "h:mm a")}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-sm text-gray-300">
                      MAIRA is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-cyan-500/40">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 transform translate-x-6 sm:translate-x-8 -translate-y-6 sm:-translate-y-8">
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Ask MAIRA
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Get instant answers about your clients and schedule
              </p>
            </div>
          </div>

          {/* Input Field */}
          <div className="flex gap-2 sm:gap-3 mb-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your business..."
              className="flex-1 bg-black/40 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 h-11 sm:h-12 text-sm sm:text-base px-3 sm:px-4"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="h-11 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] sm:min-w-[56px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>

          {/* Quick Actions - Only show when no messages */}
          {messages.length === 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-3">Quick actions:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs sm:text-sm p-3 bg-black/30 hover:bg-black/50 text-gray-300 hover:text-white rounded-lg sm:rounded-xl transition-all duration-200 text-left border border-gray-700/50 hover:border-gray-600 min-h-[44px] flex items-center"
                    disabled={isLoading}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
