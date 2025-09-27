import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Phone, 
  Mail, 
  Clock, 
  AlertTriangle,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const urgencyColors = {
  low: 'bg-gray-600 text-gray-200',
  medium: 'bg-amber-500 text-white',
  high: 'bg-orange-500 text-white',
  critical: 'bg-red-500 text-white animate-pulse'
};

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  lead: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  inactive: 'bg-gray-700/20 text-gray-500 border-gray-700/30'
};

export default function ClientCard({ client, onClick }) {
  const isOverdue = client.next_followup && new Date(client.next_followup) < new Date();
  
  return (
    <div 
      onClick={() => onClick(client)}
      className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-900/70"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{client.full_name}</h3>
            <p className="text-sm text-gray-400">{client.phone}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={urgencyColors[client.urgency_level]}>
            {client.urgency_level === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {client.urgency_level}
          </Badge>
          <Badge variant="outline" className={statusColors[client.status]}>
            {client.status}
          </Badge>
        </div>
      </div>

      {/* Client Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>{client.property_type?.replace(/_/g, ' ') || 'Property type not set'}</span>
        </div>
        
        {client.budget_min && client.budget_max && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span>${client.budget_min.toLocaleString()} - ${client.budget_max.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Last Interaction */}
      {client.last_interaction && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Last contact: {formatDistanceToNow(new Date(client.last_interaction), { addSuffix: true })}</span>
          </div>
        </div>
      )}

      {/* Next Follow-up */}
      {client.next_followup && (
        <div className={`flex items-center gap-2 text-sm mt-2 ${isOverdue ? 'text-red-400' : 'text-amber-400'}`}>
          {isOverdue && <AlertTriangle className="w-4 h-4" />}
          <span>
            {isOverdue ? 'Overdue: ' : 'Follow-up: '}
            {format(new Date(client.next_followup), 'MMM d, h:mm a')}
          </span>
        </div>
      )}

      {/* MAIRA Summary Preview */}
      {client.maira_summary && (
        <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border-l-2 border-cyan-500">
          <p className="text-xs text-cyan-400 mb-1">MAIRA Summary</p>
          <p className="text-sm text-gray-300 line-clamp-2">{client.maira_summary}</p>
        </div>
      )}
    </div>
  );
}