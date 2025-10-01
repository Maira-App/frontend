import React, { useState, useEffect, useRef } from "react";
import { Activity as ActivityEntity, Client } from "@/entities/all.js";
import { format, startOfDay, endOfDay } from "date-fns";
import { Activity } from "lucide-react";
import ActivityCard from "../components/dashboard/ActivityCard.jsx";
import ToolExecutionPanel from "../components/ToolExecutionPanel.jsx";

export default function Voice() {
  const [activities, setActivities] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const widgetRef = useRef(null);

  useEffect(() => {
    loadActivityData();
  }, []);

  useEffect(() => {
    // Load ElevenLabs widget script and create widget
    const loadElevenLabsWidget = () => {
      // Check if script is already loaded
      if (
        document.querySelector(
          'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
        )
      ) {
        createWidget();
        return;
      }

      // Load the script
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";
      script.onload = () => {
        createWidget();
      };
      document.head.appendChild(script);
    };

    const createWidget = () => {
      if (widgetRef.current) {
        // Clear any existing content
        widgetRef.current.innerHTML = "";

        // Create the custom element
        const widget = document.createElement("elevenlabs-convai");
        widget.setAttribute("agent-id", "agent_5401k4nv6p1pe4ss287s5w81wxwy");

        // Add some styling
        widget.style.width = "100%";
        widget.style.height = "400px";
        widget.style.borderRadius = "12px";
        widget.style.overflow = "hidden";

        widgetRef.current.appendChild(widget);
      }
    };

    loadElevenLabsWidget();

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = "";
      }
    };
  }, []);

  const loadActivityData = async () => {
    setIsLoading(true);
    try {
      const [activitiesData, clientsData] = await Promise.all([
        ActivityEntity.getAll({ limit: 20 }),
        Client.getAll({ limit: 50 }),
      ]);

      setActivities(activitiesData);
      setClients(clientsData);
    } catch (error) {
      console.error("Error loading activity data:", error);
    }
    setIsLoading(false);
  };

  const getClientById = (clientId) => {
    return clients.find((client) => client.id === clientId);
  };

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    activities.forEach((activity) => {
      const date = format(new Date(activity.created_date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  };

  const formatDateGroup = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Today";
    } else if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) {
      return "Yesterday";
    } else {
      return format(date, "EEEE, MMM d");
    }
  };

  return (
    <div className="h-full bg-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Voice Assistant
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Connect with MAIRA through voice conversation to get real estate
            assistance
          </p>
        </div>

        {/* ElevenLabs Widget */}
        <div className="mb-8">
          <div
            ref={widgetRef}
            className="w-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            {/* Widget will be dynamically inserted here */}
          </div>
        </div>

        {/* Tool Execution Panel */}
        <div className="mb-8">
          <ToolExecutionPanel />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Recent Activity
            </h2>
            <div className="text-xs sm:text-sm text-gray-400">
              {activities.length} total activities
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 text-sm sm:text-base">
                Loading recent activity...
              </p>
            </div>
          ) : Object.entries(groupActivitiesByDate(activities)).length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 text-base sm:text-lg mb-2">
                No recent activity
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                MAIRA will start logging activities here
              </p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {Object.entries(groupActivitiesByDate(activities))
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, dayActivities]) => (
                  <div key={date} className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <h3 className="text-base sm:text-lg font-medium text-white">
                        {formatDateGroup(date)}
                      </h3>
                      <div className="flex-1 h-px bg-gray-800"></div>
                      <span className="text-xs sm:text-sm text-gray-500">
                        {dayActivities.length}{" "}
                        {dayActivities.length === 1 ? "activity" : "activities"}
                      </span>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {dayActivities.map((activity) => (
                        <ActivityCard
                          key={activity.id}
                          activity={activity}
                          client={getClientById(activity.client_id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
