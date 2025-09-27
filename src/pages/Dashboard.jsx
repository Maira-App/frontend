import React, { useState, useEffect } from "react";
import { Activity as ActivityEntity, Client } from "@/entities/all.js";
import { format, startOfDay, endOfDay } from "date-fns";
import { Activity } from "lucide-react";

import ActivityCard from "../components/dashboard/ActivityCard.jsx";
import QuickStats from "../components/dashboard/QuickStats.jsx";
import TodaysHighlights from "../components/dashboard/TodaysHighlights.jsx";
import ChatInput from "../components/chat/ChatInput.jsx";

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [activitiesData, clientsData] = await Promise.all([
        ActivityEntity.getAll({ limit: 20 }),
        Client.getAll({ limit: 50 }),
      ]);

      setActivities(activitiesData);
      setClients(clientsData);

      // Calculate today's stats
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const todayActivities = activitiesData.filter((activity) => {
        const activityDate = new Date(activity.created_date);
        return activityDate >= todayStart && activityDate <= todayEnd;
      });

      const todayStats = {
        calls_made: todayActivities.filter((a) => a.action_type === "call_made")
          .length,
        tasks_completed: todayActivities.filter(
          (a) => a.completion_status === "completed"
        ).length,
        meetings_scheduled: todayActivities.filter(
          (a) => a.action_type === "meeting_scheduled"
        ).length,
        follow_ups_sent: todayActivities.filter(
          (a) => a.action_type === "follow_up_scheduled"
        ).length,
        active_clients: clientsData.filter((c) => c.status === "active").length,
      };

      setStats(todayStats);

      // Mock upcoming events
      const mockUpcoming = [
        "2 property showings this afternoon",
        "3 client follow-ups scheduled tomorrow",
        "Market analysis report due Friday",
        "Team meeting at 4 PM",
      ];
      setUpcomingEvents(mockUpcoming);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm sm:text-base">
            Loading MAIRA dashboard...
          </p>
        </div>
      </div>
    );
  }

  const activityGroups = groupActivitiesByDate(activities);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Here's what MAIRA has been working on
          </p>
        </div>

        {/* Chat Input */}
        <ChatInput />

        {/* Quick Stats */}
        <QuickStats stats={stats} />

        {/* Today's Highlights */}
        <TodaysHighlights stats={stats} upcomingEvents={upcomingEvents} />

        {/* Activity Timeline */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Recent Activity
            </h2>
            <div className="text-xs sm:text-sm text-gray-400">
              {activities.length} total activities
            </div>
          </div>

          {Object.entries(activityGroups).length === 0 ? (
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
              {Object.entries(activityGroups)
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
