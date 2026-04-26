import { useEffect, useState } from "react";
import { fetchHistory } from "../lib/historyService";

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
      const res = await fetchHistory();
      setData(res);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      
      <h1 className="text-2xl font-bold mb-6">History</h1>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400">{item.date}</p>
              <p className="text-lg font-semibold">
                {item.reason}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-red-400">
                {item.suspicion_score}%
              </p>
              <p
                className={`text-sm ${
                  item.anomaly_flag
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {item.anomaly_flag ? "Anomaly" : "Normal"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;