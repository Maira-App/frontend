import React from 'react';
import { format } from 'date-fns';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ClientDetails({ client, onClose }) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{client.full_name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={
                client.urgency_level === 'critical' ? 'bg-red-500 text-white' :
                client.urgency_level === 'high' ? 'bg-orange-500 text-white' :
                client.urgency_level === 'medium' ? 'bg-amber-500 text-white' :
                'bg-gray-600 text-gray-200'
              }>
                {client.urgency_level} priority
              </Badge>
              <Badge variant="outline" className="text-gray-300 border-gray-600">
                {client.status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
              <Phone className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm text-gray-400">Phone</p>
                <p className="text-white font-medium">{client.phone}</p>
              </div>
            </div>
            
            {client.email && (
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                <Mail className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">{client.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Property Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Property Type</p>
                  <p className="text-white font-medium">
                    {client.property_type?.replace(/_/g, ' ') || 'Not specified'}
                  </p>
                </div>
              </div>
              
              {client.budget_min && client.budget_max && (
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />  
                  <div>
                    <p className="text-sm text-gray-400">Budget Range</p>
                    <p className="text-white font-medium">
                      ${client.budget_min.toLocaleString()} - ${client.budget_max.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {client.preferred_areas && client.preferred_areas.length > 0 && (
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Preferred Areas</p>
                <div className="flex flex-wrap gap-2">
                  {client.preferred_areas.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-gray-300 border-gray-600">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timing */}
          {(client.last_interaction || client.next_followup) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.last_interaction && (
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Last Interaction</p>
                      <p className="text-white font-medium">
                        {format(new Date(client.last_interaction), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}
                
                {client.next_followup && (
                  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-sm text-gray-400">Next Follow-up</p>
                      <p className="text-white font-medium">
                        {format(new Date(client.next_followup), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MAIRA Summary */}
          {client.maira_summary && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                MAIRA Summary
              </h3>
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-gray-200 leading-relaxed">{client.maira_summary}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Notes</h3>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-300 leading-relaxed">{client.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}