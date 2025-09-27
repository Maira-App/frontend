import React from "react";
import { format } from "date-fns";
import { Phone, Mail, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  active: "bg-green-500 text-white",
  lead: "bg-blue-500 text-white",
  closed: "bg-gray-500 text-white",
  inactive: "bg-yellow-500 text-white",
};

const propertyTypeColors = {
  residential_buy: "bg-blue-500 text-white",
  residential_sell: "bg-blue-500 text-white",
  commercial_buy: "bg-purple-500 text-white",
  commercial_sell: "bg-purple-500 text-white",
  rental: "bg-orange-500 text-white",
  investment: "bg-orange-500 text-white",
};

export default function ClientCard({ client, onClick }) {
  const formatPropertyType = (type) => {
    if (!type) return "residential";
    const typeMap = {
      residential_buy: "residential",
      residential_sell: "residential",
      commercial_buy: "commercial",
      commercial_sell: "commercial",
      rental: "investment",
      investment: "investment",
    };
    return typeMap[type] || "residential";
  };

  const formatValue = (min, max) => {
    if (!min || !max) return "";
    const formatK = (val) =>
      val >= 1000 ? `${Math.round(val / 1000)}K` : val.toString();
    return `$${formatK(min)} - $${formatK(max)}`;
  };

  const getLastUpdateDate = () => {
    const date =
      client.last_interaction || client.updated_at || client.created_at;
    if (!date) return "";
    return format(new Date(date), "MMM d");
  };

  return (
    <div
      onClick={() => onClick(client)}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 cursor-pointer transition-all duration-200 hover:bg-gray-800/70"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <div>
            <h3 className="font-medium text-white text-sm">
              {client.full_name}
            </h3>
            <Badge
              className={`${
                statusColors[client.status]
              } text-xs px-2 py-0.5 mt-1`}
            >
              {client.status}
            </Badge>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{getLastUpdateDate()}</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-3">
        {client.email && (
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Mail className="w-3 h-3 text-gray-400" />
            <span>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Phone className="w-3 h-3 text-gray-400" />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between">
        <Badge
          className={`${
            propertyTypeColors[client.property_type] ||
            propertyTypeColors.residential_buy
          } text-xs px-2 py-0.5`}
        >
          {formatPropertyType(client.property_type)}
        </Badge>

        {client.budget_min && client.budget_max && (
          <div className="flex items-center gap-1 text-xs text-white font-medium">
            <span>$</span>
            <span>{formatValue(client.budget_min, client.budget_max)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
