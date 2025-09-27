import React, { useState, useEffect } from "react";
import { Client } from "@/entities/all";
import { Search, Filter, Users, Plus, RefreshCw, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import ClientCard from "../components/clients/ClientCard";
import ClientDetails from "../components/clients/ClientDetails";
import AddClientForm from "../components/clients/AddClientForm";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (clients) {
      filterClients();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clients, searchQuery, statusFilter, urgencyFilter, propertyTypeFilter]);

  const loadClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch clients associated with the current logged-in agent
      const data = await Client.list("-updated_date");
      // Loaded clients for current agent
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      setError("Failed to load clients. Please try again.");
      // Set empty array on error to prevent crashes
      setClients([]);
    }
    setIsLoading(false);
  };

  const filterClients = () => {
    let filtered = clients || [];

    // Search filter - enhanced to search more fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.full_name?.toLowerCase().includes(query) ||
          client.phone?.includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.property_type?.toLowerCase().includes(query) ||
          client.preferred_areas?.some((area) =>
            area.toLowerCase().includes(query)
          ) ||
          client.notes?.toLowerCase().includes(query) ||
          client.maira_summary?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    // Urgency filter
    if (urgencyFilter !== "all") {
      filtered = filtered.filter(
        (client) => client.urgency_level === urgencyFilter
      );
    }

    // Property type filter
    if (propertyTypeFilter !== "all") {
      filtered = filtered.filter(
        (client) => client.property_type === propertyTypeFilter
      );
    }

    // Sort by urgency (critical first) then by last interaction
    filtered.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const urgencyDiff =
        urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];

      if (urgencyDiff !== 0) return urgencyDiff;

      // Then by next follow-up (overdue first)
      const aOverdue =
        a.next_followup && new Date(a.next_followup) < new Date();
      const bOverdue =
        b.next_followup && new Date(b.next_followup) < new Date();

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      // Finally by last interaction (most recent first)
      if (a.last_interaction && b.last_interaction) {
        return new Date(b.last_interaction) - new Date(a.last_interaction);
      }

      return 0;
    });

    setFilteredClients(filtered);
  };

  const getStatusCounts = () => {
    const clientList = clients || [];
    return {
      all: clientList.length,
      active: clientList.filter((c) => c.status === "active").length,
      lead: clientList.filter((c) => c.status === "lead").length,
      closed: clientList.filter((c) => c.status === "closed").length,
      inactive: clientList.filter((c) => c.status === "inactive").length,
    };
  };

  const getUrgentClients = () => {
    const clientList = clients || [];
    return clientList.filter(
      (c) =>
        c.urgency_level === "critical" ||
        c.urgency_level === "high" ||
        (c.next_followup && new Date(c.next_followup) < new Date())
    ).length;
  };

  const handleClientAdded = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
    setShowAddForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const urgentCount = getUrgentClients();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Clients
            </h1>
            <p className="text-gray-400 mt-2">
              {(clients || []).length} total clients • {urgentCount} need
              attention
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadClients}
              disabled={isLoading}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              className="bg-cyan-600 hover:bg-cyan-700"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-red-400">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search clients by name, phone, email, property type, areas, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
            />
          </div>

          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Status ({statusCounts.all})</option>
              <option value="active">Active ({statusCounts.active})</option>
              <option value="lead">Leads ({statusCounts.lead})</option>
              <option value="closed">Closed ({statusCounts.closed})</option>
              <option value="inactive">
                Inactive ({statusCounts.inactive})
              </option>
            </select>

            {/* Urgency Filter */}
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Property Type Filter */}
            <select
              value={propertyTypeFilter}
              onChange={(e) => setPropertyTypeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Property Types</option>
              <option value="residential_buy">Residential Buy</option>
              <option value="residential_sell">Residential Sell</option>
              <option value="commercial_buy">Commercial Buy</option>
              <option value="commercial_sell">Commercial Sell</option>
              <option value="rental">Rental</option>
            </select>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg mb-2">
              {searchQuery ||
              statusFilter !== "all" ||
              urgencyFilter !== "all" ||
              propertyTypeFilter !== "all"
                ? "No clients match your filters"
                : "No clients yet"}
            </p>
            <p className="text-gray-500 text-sm">
              {searchQuery ||
              statusFilter !== "all" ||
              urgencyFilter !== "all" ||
              propertyTypeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "MAIRA will start adding clients here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={setSelectedClient}
              />
            ))}
          </div>
        )}

        {/* Client Details Modal */}
        {selectedClient && (
          <ClientDetails
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}

        {/* Add Client Form Modal */}
        {showAddForm && (
          <AddClientForm
            onClose={() => setShowAddForm(false)}
            onClientAdded={handleClientAdded}
          />
        )}
      </div>
    </div>
  );
}
