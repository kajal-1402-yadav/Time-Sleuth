import { useEffect, useState } from "react";
import { fetchActivityLogs } from "../lib/activityService";

type HeatmapData = {
  hour: string;
  level: "low" | "medium" | "high";
};

const ActivityHeatmap = () => {
  const [data, setData] = useState<HeatmapData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const logs = await fetchActivityLogs();

      const grouped: { [key: string]: number } = {};

      logs.forEach((log: any) => {
        const hour = new Date(log.timestamp).getHours();

        const activity =
          log.mouse_moves + log.clicks + log.keystrokes;

        grouped[hour] = (grouped[hour] || 0) + activity;
      });

      const formatted: HeatmapData[] = Object.keys(grouped).map(
        (hour) => {
          const value = grouped[hour];

          let level: HeatmapData["level"] = "low";

          if (value > 300) level = "high";
          else if (value > 100) level = "medium";

          return {
            hour: `${hour}:00`,
            level,
          };
        }
      );

      setData(formatted);
    };

    loadData();
  }, []);

  const getColor = (level: string) => {
    if (level === "high") return "bg-green-500";
    if (level === "medium") return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="grid grid-cols-6 gap-3">
      {data.map((item, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg text-center text-sm font-medium ${getColor(
            item.level
          )}`}
        >
          {item.hour}
        </div>
      ))}
    </div>
  );
};

export default ActivityHeatmap;