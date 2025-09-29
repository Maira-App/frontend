import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvokeLLM } from "@/integrations/Core";
import { Client, Activity } from "@/entities/all";
import { format } from "date-fns";

export default function ChatWidget({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when first opened
      setMessages([
        {
          id: 1,
          text: "Hi! I'm MAIRA, your real estate assistant. I can help you with client information, property insights, schedule management, and answer any questions about your business. How can I assist you today?",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

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
        Client.list("-updated_date", 10),
        Activity.list("-created_date", 20),
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

User question: "${inputValue}"

Please provide a helpful, concise response as MAIRA. Be professional but friendly. If the question is about specific clients or activities, reference the context data. If you need more information, ask clarifying questions. Keep responses under 200 words.`,
        add_context_from_internet: false,
      });

      const botMessage = {
        id: messages.length + 2,
        text: response,
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
    handleSend();
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">MAIRA</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-white/80">Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isBot ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[280px] p-3 rounded-2xl ${
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
                <div className="bg-gray-800 p-3 rounded-2xl border border-gray-700">
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

          {/* Quick Actions */}
          {messages.length === 1 && !isLoading && (
            <div className="p-3 border-t border-gray-800 bg-gray-900/50">
              <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200 text-left"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask MAIRA anything..."
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
