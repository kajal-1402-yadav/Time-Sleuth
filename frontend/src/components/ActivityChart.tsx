import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useEffect, useState } from "react";
import { fetchActivityLogs } from "../lib/activityService";

// ✅ Proper type for DB logs
type ActivityLog = {
  id: string;
  user_id: string;
  timestamp: string;
  mouse_moves: number;
  clicks: number;
  keystrokes: number;
  idle_time: number;
};

// ✅ Type for chart data
type ActivityData = {
  time: string;
  active: number;
  idle: number;
};

const ActivityChart = () => {
  const [data, setData] = useState<ActivityData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const logs = (await fetchActivityLogs()) as ActivityLog[];

      const formatted = logs.map((log) => ({
        time: new Date(log.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        active:
          log.mouse_moves + log.clicks + log.keystrokes,
        idle: log.idle_time,
      }));

      setData(formatted);
    };

    // initial load
    loadData();

    // 🔁 auto refresh
    const interval = setInterval(loadData, 5000);

    return () => clearInterval(interval);
  }, []);


    return (
  <div className="w-full h-[280px] min-w-0 min-h-0">
    <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={0}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

        <XAxis dataKey="time" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "none",
            borderRadius: "10px",
          }}
        />

        <Line type="monotone" dataKey="active" stroke="#22C55E" strokeWidth={3} />
        <Line type="monotone" dataKey="idle" stroke="#F59E0B" strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  );
};

export default ActivityChart;