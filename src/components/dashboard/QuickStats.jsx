import React from 'react';
import { Phone, Calendar, CheckCircle, Users } from 'lucide-react';

export default function QuickStats({ stats }) {
  const statItems = [
    {
      label: 'Calls Today',
      value: stats?.calls_made || 0,
      icon: Phone,
      color: 'text-cyan-400'
    },
    {
      label: 'Tasks Done',
      value: stats?.tasks_completed || 0,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'Meetings',
      value: stats?.meetings_scheduled || 0,
      icon: Calendar,
      color: 'text-amber-400'
    },
    {
      label: 'Active Clients',
      value: stats?.active_clients || 0,
      icon: Users,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {statItems.map((stat) => (
        <div key={stat.label} className="bg-gray-900/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-lg bg-gray-800 ${stat.color}`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-400 leading-tight">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}