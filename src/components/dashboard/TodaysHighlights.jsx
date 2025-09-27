import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function TodaysHighlights({ stats, upcomingEvents }) {
  return (
    <div className="bg-gray-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-800 mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Today's Highlights</h3>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div>
          <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
            <CheckCircle className="w-4 h-4" />
            Completed Today
          </h4>
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
            <li>• Made {stats.calls_made || 0} client calls</li>
            <li>• Scheduled {stats.meetings_scheduled || 0} property showings</li>
            <li>• Sent {stats.follow_ups_sent || 0} follow-up messages</li>
            <li>• Completed {stats.tasks_completed || 0} tasks &amp; updates</li>
          </ul>
        </div>
        <div>
          <h4 className="text-amber-400 font-medium mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Clock className="w-4 h-4" />
            Upcoming
          </h4>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
              {upcomingEvents.map((event, index) => (
                <li key={index}>• {event}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">No upcoming events scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
}