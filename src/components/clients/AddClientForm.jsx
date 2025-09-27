import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client } from "@/entities/all";

export default function AddClientForm({ onClose, onClientAdded }) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    property_type: "residential_buy",
    budget_min: "",
    budget_max: "",
    preferred_areas: "",
    urgency_level: "medium",
    status: "lead",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert preferred_areas string to array
      const clientData = {
        ...formData,
        preferred_areas: formData.preferred_areas
          ? formData.preferred_areas
              .split(",")
              .map((area) => area.trim())
              .filter((area) => area)
          : [],
        budget_min: formData.budget_min ? parseInt(formData.budget_min) : null,
        budget_max: formData.budget_max ? parseInt(formData.budget_max) : null,
      };

      const newClient = await Client.create(clientData);

      if (onClientAdded) {
        onClientAdded(newClient);
      }

      onClose();
    } catch (error) {
      console.error("Error creating client:", error);
      setError(error.message || "Failed to create client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Client</h2>
            <p className="text-gray-400 mt-1">Create a new client profile</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Smith"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone *
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1-555-0123"
                  required
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Property Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              Property Requirements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="residential_buy">Residential Buy</option>
                  <option value="residential_sell">Residential Sell</option>
                  <option value="commercial_buy">Commercial Buy</option>
                  <option value="commercial_sell">Commercial Sell</option>
                  <option value="rental">Rental</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Urgency Level
                </label>
                <select
                  name="urgency_level"
                  value={formData.urgency_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Min ($)
                </label>
                <Input
                  name="budget_min"
                  type="number"
                  value={formData.budget_min}
                  onChange={handleInputChange}
                  placeholder="300000"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Max ($)
                </label>
                <Input
                  name="budget_max"
                  type="number"
                  value={formData.budget_max}
                  onChange={handleInputChange}
                  placeholder="500000"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Areas
              </label>
              <Input
                name="preferred_areas"
                value={formData.preferred_areas}
                onChange={handleInputChange}
                placeholder="Downtown, Suburbs, City Center (comma-separated)"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              Additional Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this client..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
