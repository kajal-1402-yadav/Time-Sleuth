import { useEffect, useState } from "react";
import { fetchAnalysisHistory } from "../lib/historyService";

type HistoryItem = {
  date: string;
  suspicion_score: number;
  anomaly_flag: boolean;
  reason: string;
};

const History = () => {
  const [data, setData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchAnalysisHistory();
      setData(res);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">History</h1>

      <div className="space-y-4">
        {data.length === 0 ? (
  <div className="text-center text-gray-400 mt-10">
    No history available yet
  </div>
) : (
  <div className="space-y-4">
    {data.map((item, index) => (
      <div
        key={index}
        className="bg-gray-800 p-4 rounded-xl flex justify-between items-center"
      >
        <div>
          <p className="font-semibold">{item.date}</p>
          <p className="text-sm text-gray-400">{item.reason}</p>
        </div>

        <div className="text-right">
          <p
            className={`font-bold ${
              item.anomaly_flag
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {item.suspicion_score}%
          </p>

          <p className="text-xs text-gray-500">
            {item.anomaly_flag ? "Suspicious" : "Normal"}
          </p>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
};

export default History;