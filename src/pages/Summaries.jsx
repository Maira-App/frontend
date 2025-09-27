
import React, { useState, useEffect } from "react";
import { Summary, Activity, Client } from "@/entities/all";
import { format, startOfDay, endOfDay } from "date-fns";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Phone, 
  Calendar as CalendarIcon,
  Users,
  Lightbulb,
  Target
} from "lucide-react";

export default function Summaries() {
  const [summaries, setSummaries] = useState([]);
  const [todayStats, setTodayStats] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSummariesData();
  }, []);

  const loadSummariesData = async () => {
    setIsLoading(true);
    try {
      const [summariesData, activitiesData, clientsData] = await Promise.all([
        Summary.list('-date', 10),
        Activity.list('-created_date', 50),
        Client.list('-updated_date')
      ]);

      setSummaries(summariesData);

      // Calculate today's comprehensive stats
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);
      
      const todayActivities = activitiesData.filter(activity => {
        const activityDate = new Date(activity.created_date);
        return activityDate >= todayStart && activityDate <= todayEnd;
      });

      const stats = {
        calls_made: todayActivities.filter(a => a.action_type === 'call_made').length,
        tasks_completed: todayActivities.filter(a => a.completion_status === 'completed').length,
        meetings_scheduled: todayActivities.filter(a => a.action_type === 'meeting_scheduled').length,
        follow_ups_sent: todayActivities.filter(a => a.action_type === 'follow_up_scheduled').length,
        total_activities: todayActivities.length,
        active_clients: clientsData.filter(c => c.status === 'active').length,
        urgent_clients: clientsData.filter(c => c.urgency_level === 'critical' || c.urgency_level === 'high').length
      };

      setTodayStats(stats);

      // Generate AI suggestions (mock for now)
      const mockSuggestions = [
        {
          suggestion: "Follow up with 3 clients who haven't been contacted in over a week",
          priority: "high",
          category: "Client Outreach"
        },
        {
          suggestion: "Schedule property showings for this weekend - 5 interested buyers waiting",
          priority: "medium", 
          category: "Scheduling"
        },
        {
          suggestion: "Update CRM with recent property price changes in downtown area",
          priority: "low",
          category: "Data Management"
        }
      ];

      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error loading summaries data:', error);
    }
    setIsLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'low':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading summaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Summaries</h1>
          <p className="text-gray-400 mt-2">Insights and recommendations from MAIRA</p>
        </div>

        {/* Today's Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Today's Performance Snapshot</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{todayStats.calls_made || 0}</p>
                  <p className="text-sm text-gray-400">Calls Made</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{todayStats.tasks_completed || 0}</p>
                  <p className="text-sm text-gray-400">Tasks Done</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <CalendarIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{todayStats.meetings_scheduled || 0}</p>
                  <p className="text-sm text-gray-400">Meetings Set</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{todayStats.active_clients || 0}</p>
                  <p className="text-sm text-gray-400">Active Clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIRA Suggestions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-cyan-400" />
            MAIRA Suggests...
          </h2>
          
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-gray-400">{suggestion.category}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority} priority
                      </div>
                    </div>
                    <p className="text-white text-sm leading-relaxed">{suggestion.suggestion}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                      Act on this →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Trends */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            This Week's Performance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-medium mb-4">Client Interactions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Monday</span>
                  <span className="text-white font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Tuesday</span>
                  <span className="text-white font-medium">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Wednesday</span>
                  <span className="text-white font-medium">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 text-sm">Today</span>
                  <span className="text-cyan-400 font-medium">{todayStats.total_activities || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-medium mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Avg. Response</span>
                  <span className="text-green-400 font-medium">Less than 5 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Missed Calls</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Follow-up Rate</span>
                  <span className="text-green-400 font-medium">98%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-white font-medium mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Conversion Rate</span>
                  <span className="text-green-400 font-medium">24%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Active Leads</span>
                  <span className="text-white font-medium">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Urgent Clients</span>
                  <span className="text-amber-400 font-medium">{todayStats.urgent_clients || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
