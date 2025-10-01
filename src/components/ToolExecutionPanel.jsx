import React, { useState, useEffect } from "react";
import {
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ToolExecutionPanel() {
  const [toolExecutions, setToolExecutions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial tool executions
    fetchToolExecutions();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchToolExecutions, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchToolExecutions = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/api/tool-executions?limit=10`);

      if (!response.ok) throw new Error("Failed to fetch tool executions");

      const data = await response.json();
      setToolExecutions(data.tool_executions || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tool executions:", error);
      setIsLoading(false);
    }
  };

  const getToolIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getToolColor = (toolName) => {
    if (toolName.includes("client")) return "text-blue-400";
    if (toolName.includes("appointment") || toolName.includes("schedule"))
      return "text-purple-400";
    if (toolName.includes("context")) return "text-cyan-400";
    return "text-gray-400";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return "just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  const formatToolName = (name) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">AI Tool Activity</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">AI Tool Activity</h3>
          {toolExecutions.length > 0 && (
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
              {toolExecutions.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Tool Executions List */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {toolExecutions.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No tool executions yet</p>
              <p className="text-gray-600 text-xs mt-1">
                Tool calls will appear here in real-time
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {toolExecutions.map((execution, index) => (
                <ToolExecutionItem
                  key={execution.id || index}
                  execution={execution}
                  getToolIcon={getToolIcon}
                  getToolColor={getToolColor}
                  formatToolName={formatToolName}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ToolExecutionItem({
  execution,
  getToolIcon,
  getToolColor,
  formatToolName,
  formatTimestamp,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{getToolIcon(execution.status)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-medium ${getToolColor(execution.tool_name)}`}
              >
                {formatToolName(execution.tool_name)}
              </span>
            </div>
            {execution.execution_duration_ms && (
              <div className="text-xs text-gray-500 mt-1">
                Executed in {execution.execution_duration_ms}ms
              </div>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500 ml-2">
          {formatTimestamp(execution.executed_at)}
        </span>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          {execution.arguments &&
            Object.keys(execution.arguments).length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-gray-400 mb-1">Arguments:</div>
                <pre className="text-xs text-gray-300 bg-gray-900 p-2 rounded overflow-x-auto">
                  {JSON.stringify(execution.arguments, null, 2)}
                </pre>
              </div>
            )}

          {execution.error_message && (
            <div className="text-xs text-red-400 bg-red-900/20 p-2 rounded">
              Error: {execution.error_message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
