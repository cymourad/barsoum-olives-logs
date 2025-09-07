import { useState } from "react";
import { TreeLog } from "../types";
import { supabase } from "../lib/supabase";

interface TreeLogsListProps {
  logs: TreeLog[];
  onRefresh: () => void;
}

const TreeLogsList = ({ logs }: TreeLogsListProps) => {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [logDetails, setLogDetails] = useState<Record<string, any>>({});

  const toggleLogExpansion = async (logId: string) => {
    const newExpanded = new Set(expandedLogs);

    if (expandedLogs.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
      // Load log details if not already loaded
      if (!logDetails[logId]) {
        await loadLogDetails(logId);
      }
    }

    setExpandedLogs(newExpanded);
  };

  const loadLogDetails = async (logId: string) => {
    const log = logs.find((l) => l.id === logId);
    if (!log) return;

    try {
      let tableName = "";
      switch (log.action_type) {
        case "pruning":
          tableName = "pruning_logs";
          break;
        case "irrigation":
          tableName = "irrigation_logs";
          break;
        case "harvesting":
          tableName = "harvesting_logs";
          break;
        case "fertilizing":
          tableName = "fertilizing_logs";
          break;
        case "treatment":
          tableName = "treatment_logs";
          break;
        case "flowering":
          tableName = "flowering_logs";
          break;
        case "weather":
          tableName = "weather_logs";
          break;
        default:
          return;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("tree_log_id", logId)
        .single();

      if (error) throw error;

      setLogDetails((prev) => ({ ...prev, [logId]: data }));
    } catch (error) {
      console.error("Error loading log details:", error);
    }
  };

  const renderLogDetails = (log: TreeLog) => {
    const details = logDetails[log.id];
    if (!details)
      return <div className="text-gray-500">Loading details...</div>;

    switch (log.action_type) {
      case "pruning":
        return (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(details)
              .filter(([key]) => key !== "id" && key !== "tree_log_id")
              .map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">
                    {key.replace("_", " ")}:
                  </span>
                  <span className={value ? "text-green-600" : "text-gray-400"}>
                    {value ? "✓" : "✗"}
                  </span>
                </div>
              ))}
          </div>
        );

      case "irrigation":
        return (
          <div className="space-y-1 text-sm">
            {details.number_of_drippers && (
              <div>Drippers: {details.number_of_drippers}</div>
            )}
            {details.number_of_hours && (
              <div>Hours: {details.number_of_hours}</div>
            )}
          </div>
        );

      case "harvesting":
        return (
          <div className="space-y-1 text-sm">
            {details.amount_kgs && <div>Amount: {details.amount_kgs} kg</div>}
          </div>
        );

      case "treatment":
        return (
          <div className="space-y-1 text-sm">
            <div>White Oil: {details.white_oil ? "✓" : "✗"}</div>
            {details.other && <div>Other: {details.other}</div>}
          </div>
        );

      case "flowering":
        return (
          <div className="space-y-1 text-sm">
            {details.percentage_initial && (
              <div>Initial: {details.percentage_initial}%</div>
            )}
            {details.percentage_remaining && (
              <div>Remaining: {details.percentage_remaining}%</div>
            )}
          </div>
        );

      default:
        return <div className="text-gray-500">Details not available</div>;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "pruning":
        return "✂️";
      case "irrigation":
        return "💧";
      case "harvesting":
        return "🫒";
      case "fertilizing":
        return "🌱";
      case "treatment":
        return "💊";
      case "flowering":
        return "🌸";
      case "weather":
        return "🌤️";
      default:
        return "📝";
    }
  };

  if (logs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Activity Logs
        </h2>
        <div className="text-center py-8 text-gray-500">
          No logs recorded yet. Add your first log entry to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Activity Logs
      </h2>
      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="border border-gray-200 rounded-lg">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() => toggleLogExpansion(log.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">
                    {getActionIcon(log.action_type)}
                  </span>
                  <div>
                    <div className="font-medium text-gray-800 capitalize">
                      {log.action_type.replace("_", " ")}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(log.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    expandedLogs.has(log.id) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedLogs.has(log.id) && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-3">{renderLogDetails(log)}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TreeLogsList;
