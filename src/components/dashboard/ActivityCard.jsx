import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Phone, 
  Calendar, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Home,
  UserPlus,
  MessageSquare
} from 'lucide-react';

const activityIcons = {
  call_made: Phone,
  follow_up_scheduled: Clock,
  calendar_updated: Calendar,
  property_shared: Home,
  email_sent: Mail,
  task_completed: CheckCircle,
  meeting_scheduled: Calendar,
  reminder_set: AlertCircle
};

const statusColors = {
  completed: 'text-green-400 bg-green-400/10 border-green-400/20',
  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  failed: 'text-red-400 bg-red-400/10 border-red-400/20'
};

export default function ActivityCard({ activity, client }) {
  const Icon = activityIcons[activity.action_type] || MessageSquare;
  const statusColor = statusColors[activity.completion_status] || statusColors.completed;
  
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-900/50 rounded-lg sm:rounded-xl border border-gray-800 hover:border-gray-700 transition-colors duration-200">
      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center ${statusColor}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white truncate text-sm sm:text-base leading-tight">{activity.title}</h3>
            {client && (
              <p className="text-xs sm:text-sm text-cyan-400 mt-1">{client.full_name}</p>
            )}
            {activity.description && (
              <p className="text-xs sm:text-sm text-gray-300 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed">{activity.description}</p>
            )}
          </div>
          
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(activity.created_date), { addSuffix: true })}
            </p>
            {activity.call_duration && (
              <p className="text-xs text-gray-500 mt-1">
                {activity.call_duration}m call
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}