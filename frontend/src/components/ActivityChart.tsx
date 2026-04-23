import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { time: "9 AM", active: 30, idle: 10 },
  { time: "10 AM", active: 50, idle: 5 },
  { time: "11 AM", active: 40, idle: 15 },
  { time: "12 PM", active: 60, idle: 10 },
  { time: "1 PM", active: 20, idle: 30 },
  { time: "2 PM", active: 70, idle: 5 },
];

const ActivityChart = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
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

          <Line
            type="monotone"
            dataKey="active"
            stroke="#22C55E"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="idle"
            stroke="#F59E0B"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;