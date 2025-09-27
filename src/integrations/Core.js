// Core integration functions for MAIRA backend API

import { apiClient } from "../lib/api/client.js";
import { getCurrentAgentId } from "../lib/utils/auth.js";

// Main LLM invocation function
export async function InvokeLLM(message, context = {}) {
  try {
    // The orchestration service doesn't have a direct chat endpoint
    // This would typically use tool execution for LLM interactions
    // For now, use the fallback mock response in development

    if (import.meta.env.DEV) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const responses = [
        "I understand. Let me help you with that request.",
        "Based on your query, here's what I found...",
        "I've processed your request. Here are the details:",
        "That's a great question. Let me provide you with the information you need.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      return {
        success: true,
        response: randomResponse,
        timestamp: new Date().toISOString(),
        context: context,
        fallback: true,
      };
    }

    // In production, this might use a specific tool for chat functionality
    // or route to the voice agent service
    throw new Error("LLM chat endpoint not available in production mode");
  } catch (error) {
    console.error("LLM invocation failed:", error);

    // Fallback to mock response in development
    if (import.meta.env.DEV) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        response:
          "I'm experiencing some difficulties right now, but I'm here to help. Please try again.",
        timestamp: new Date().toISOString(),
        context: context,
        fallback: true,
        error: true,
      };
    }

    throw error;
  }
}

// Voice agent integration with LiveKit
export async function invokeVoiceAgent(audioData, context = {}) {
  try {
    // Voice processing is handled through LiveKit real-time communication
    // The VoiceAssistant component provides the interface for this
    if (import.meta.env.DEV) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        response:
          "Voice processing is now available through the Voice Assistant page. Use the LiveKit integration for real-time voice communication.",
        timestamp: new Date().toISOString(),
        livekit: true,
      };
    }

    // In production, voice interactions are handled through LiveKit rooms
    // This function can be used to trigger voice sessions programmatically
    const response = await apiClient.post("/api/voice/process", {
      audioData,
      context,
    });

    return response;
  } catch (error) {
    console.error("Voice agent invocation failed:", error);
    throw error;
  }
}

// LiveKit room connection helper
export async function connectToVoiceRoom(
  roomName = "maira-voice-room",
  participantName = "User"
) {
  try {
    const response = await apiClient.post("/api/livekit/token", {
      roomName,
      participantName,
      participantId: "user-" + Date.now(),
      agentName: "MAIRA Assistant",
    });

    return {
      success: true,
      token: response.accessToken,
      wsUrl: import.meta.env.VITE_LIVEKIT_URL || "ws://localhost:7880",
      roomName,
    };
  } catch (error) {
    console.error("Failed to connect to voice room:", error);

    // Development fallback
    if (import.meta.env.DEV) {
      return {
        success: false,
        error: "LiveKit token generation not available in development mode",
        fallback: true,
      };
    }

    throw error;
  }
}

// Tool execution helper
export async function executeTool(toolName, parameters) {
  try {
    const response = await apiClient.post("/api/tools/execute", {
      toolName,
      args: parameters,
      context: {
        agentId: getCurrentAgentId(), // Get from auth context
      },
    });

    return response;
  } catch (error) {
    console.error("Tool execution failed:", error);
    throw error;
  }
}

// Health check helper
export async function checkHealth() {
  try {
    return await apiClient.health();
  } catch (error) {
    console.error("Health check failed:", error);
    return { status: "error", message: error.message };
  }
}

// Re-export API client for direct use
export { apiClient } from "../lib/api/client.js";
