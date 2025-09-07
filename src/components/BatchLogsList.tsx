import { useState } from "react";
import { OilProcessingBatchLog } from "../types";
import { supabase } from "../lib/supabase";

interface BatchLogsListProps {
  logs: OilProcessingBatchLog[];
  onRefresh: () => void;
}

const BatchLogsList = ({ logs }: BatchLogsListProps) => {
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
        case "transportation_grove_to_plant":
          tableName = "transportation_grove_to_plant_logs";
          break;
        case "processing":
          tableName = "processing_logs";
          break;
        case "filtering":
          tableName = "filtering_logs";
          break;
        case "transportation_plant_to_home":
          tableName = "transportation_plant_to_home_logs";
          break;
        case "bottling":
          tableName = "bottling_logs";
          break;
        default:
          return;
      }

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("batch_log_id", logId)
        .single();

      if (error) throw error;

      setLogDetails((prev) => ({ ...prev, [logId]: data }));
    } catch (error) {
      console.error("Error loading log details:", error);
    }
  };

  const renderLogDetails = (log: OilProcessingBatchLog) => {
    const details = logDetails[log.id];
    if (!details)
      return <div className="text-gray-500">Loading details...</div>;

    switch (log.action_type) {
      case "transportation_grove_to_plant":
      case "transportation_plant_to_home":
        return (
          <div className="space-y-1 text-sm">
            {details.driver_name && <div>Driver: {details.driver_name}</div>}
            {details.price && <div>Price: ${details.price}</div>}
          </div>
        );

      case "processing":
        return (
          <div className="space-y-1 text-sm">
            {details.plant_name && <div>Plant: {details.plant_name}</div>}
            {details.weight_kgs && <div>Weight: {details.weight_kgs} kg</div>}
            {details.yield_liters && <div>Yield: {details.yield_liters} L</div>}
            {details.percentage && <div>Percentage: {details.percentage}%</div>}
            {details.price && <div>Price: ${details.price}</div>}
            {details.notes && <div>Notes: {details.notes}</div>}
          </div>
        );

      case "filtering":
        return (
          <div className="space-y-1 text-sm">
            {details.plant_name && <div>Plant: {details.plant_name}</div>}
            {details.price && <div>Price: ${details.price}</div>}
            {details.notes && <div>Notes: {details.notes}</div>}
          </div>
        );

      case "bottling":
        return (
          <div className="space-y-1 text-sm">
            {details.container_volume_liters && (
              <div>Container Volume: {details.container_volume_liters} L</div>
            )}
          </div>
        );

      default:
        return <div className="text-gray-500">Details not available</div>;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "transportation_grove_to_plant":
        return "🚚";
      case "processing":
        return "⚙️";
      case "filtering":
        return "🔍";
      case "transportation_plant_to_home":
        return "🏠";
      case "bottling":
        return "🍾";
      default:
        return "📝";
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case "transportation_grove_to_plant":
        return "Transportation (Grove → Plant)";
      case "processing":
        return "Processing";
      case "filtering":
        return "Filtering";
      case "transportation_plant_to_home":
        return "Transportation (Plant → Home)";
      case "bottling":
        return "Bottling";
      default:
        return actionType;
    }
  };

  if (logs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Batch Activity Logs
        </h2>
        <div className="text-center py-8 text-gray-500">
          No logs recorded yet. Add your first log entry to track the oil
          processing progress.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Batch Activity Logs
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
                    <div className="font-medium text-gray-800">
                      {getActionLabel(log.action_type)}
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

export default BatchLogsList;
