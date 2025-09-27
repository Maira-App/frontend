import React from "react";
import { format } from "date-fns";
import {
  X,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  User,
  Hash,
  Clock,
  AlertTriangle,
  Database,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ClientDetails({ client, onClose }) {
  if (!client) return null;

  const urgencyColors = {
    low: "bg-gray-600 text-gray-200",
    medium: "bg-amber-500 text-white",
    high: "bg-orange-500 text-white",
    critical: "bg-red-500 text-white animate-pulse",
  };

  const statusColors = {
    active: "bg-green-500 text-white",
    lead: "bg-blue-500 text-white",
    closed: "bg-gray-500 text-white",
    inactive: "bg-yellow-500 text-white",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {client.full_name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={urgencyColors[client.urgency_level]}>
                {client.urgency_level} priority
              </Badge>
              <Badge className={statusColors[client.status]}>
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
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Client ID</p>
                  <p className="text-white font-medium text-xs font-mono">
                    {client.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Agent ID</p>
                  <p className="text-white font-medium text-xs font-mono">
                    {client.agent_id}
                  </p>
                </div>
              </div>

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
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              Property Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Property Type</p>
                  <p className="text-white font-medium">
                    {client.property_type?.replace(/_/g, " ") ||
                      "Not specified"}
                  </p>
                </div>
              </div>

              {client.budget_min && (
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Budget Min</p>
                    <p className="text-white font-medium">
                      ${client.budget_min.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {client.budget_max && (
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Budget Max</p>
                    <p className="text-white font-medium">
                      ${client.budget_max.toLocaleString()}
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
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-gray-300 border-gray-600"
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline & Interactions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Timeline & Interactions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.last_interaction && (
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Last Interaction</p>
                    <p className="text-white font-medium">
                      {format(
                        new Date(client.last_interaction),
                        "MMM d, yyyy h:mm a"
                      )}
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
                      {format(
                        new Date(client.next_followup),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.created_at && (
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Created At</p>
                    <p className="text-white font-medium">
                      {format(
                        new Date(client.created_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              )}

              {client.updated_at && (
                <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <Edit className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Updated At</p>
                    <p className="text-white font-medium">
                      {format(
                        new Date(client.updated_at),
                        "MMM d, yyyy h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAIRA Summary */}
          {client.maira_summary && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                MAIRA Summary
              </h3>
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <p className="text-gray-200 leading-relaxed">
                  {client.maira_summary}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Notes
              </h3>
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
