import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'week' or 'day'
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Mock events for demonstration
    const mockEvents = [
      {
        id: 1,
        title: "Property Showing - 123 Main St",
        start: new Date(2024, 11, 20, 10, 0),
        end: new Date(2024, 11, 20, 11, 0),
        type: "showing",
        client: "John Smith",
        isMAIRAScheduled: true
      },
      {
        id: 2,
        title: "Client Meeting - Sarah Johnson",
        start: new Date(2024, 11, 20, 14, 0),
        end: new Date(2024, 11, 20, 15, 0),
        type: "meeting",
        client: "Sarah Johnson",
        isMAIRAScheduled: false
      },
      {
        id: 3,
        title: "Follow-up Call - Mike Davis",
        start: new Date(2024, 11, 21, 9, 0),
        end: new Date(2024, 11, 21, 9, 30),
        type: "call",
        client: "Mike Davis",
        isMAIRAScheduled: true
      }
    ];
    setEvents(mockEvents);
  }, []);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const navigateWeek = (direction) => {
    if (direction === 'prev') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(event.start, day));
  };

  const getEventTypeColor = (type, isMAIRAScheduled) => {
    if (isMAIRAScheduled) {
      return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
    
    switch (type) {
      case 'showing':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'meeting':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'call':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Calendar</h1>
            <p className="text-gray-400 mt-2">
              Schedule and events managed by MAIRA
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
                className={view === 'week' ? 'bg-cyan-600 hover:bg-cyan-700' : 'text-gray-400 hover:text-white'}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-cyan-600 hover:bg-cyan-700' : 'text-gray-400 hover:text-white'}
              >
                Day
              </Button>
            </div>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('prev')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-white">
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateWeek('next')}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Today
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-sm text-gray-300">MAIRA Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-300">Property Showing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-300">Client Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-300">Follow-up Call</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
          {/* Week Header */}
          <div className="grid grid-cols-7 border-b border-gray-800">
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="p-4 text-center border-r border-gray-800 last:border-r-0">
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  {format(day, 'E')}
                </div>
                <div className={`text-2xl font-semibold mt-1 ${
                  isSameDay(day, new Date()) 
                    ? 'text-cyan-400' 
                    : 'text-white'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Week Body */}
          <div className="grid grid-cols-7 min-h-96">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div key={day.toISOString()} className="p-3 border-r border-gray-800 last:border-r-0 min-h-full">
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded-lg border text-xs cursor-pointer hover:opacity-80 transition-opacity ${getEventTypeColor(event.type, event.isMAIRAScheduled)}`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                        {event.client && (
                          <div className="text-xs opacity-75">{event.client}</div>
                        )}
                        {event.isMAIRAScheduled && (
                          <Badge variant="outline" className="text-xs mt-1 border-cyan-500/30 text-cyan-400">
                            MAIRA
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">This Week</p>
                <p className="text-xl font-semibold text-white">{events.length} Events</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-cyan-500"></div>
              <div>
                <p className="text-sm text-gray-400">MAIRA Scheduled</p>
                <p className="text-xl font-semibold text-white">
                  {events.filter(e => e.isMAIRAScheduled).length} Events
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm text-gray-400">Property Showings</p>
                <p className="text-xl font-semibold text-white">
                  {events.filter(e => e.type === 'showing').length} Scheduled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}