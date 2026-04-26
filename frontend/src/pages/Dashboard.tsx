import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SuspicionCard from "../components/SuspicionCard";
import ActivityChart from "../components/ActivityChart";
import ActivityHeatmap from "../components/ActivityHeatmap";

import { analyzeFromAPI } from "../lib/apiService";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../lib/authService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [score, setScore] = useState(0);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const runAnalysis = async () => {
      // 🔐 get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const result = await analyzeFromAPI();

      if (result) {
        setScore(result.suspicion_score);
        setReason(result.reason);
      }
    };

    // initial run
    runAnalysis();

    // 🔁 auto refresh
    const interval = setInterval(runAnalysis, 5000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 transition-all duration-500">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">
            Time Sleuth
          </h1>
          <p className="text-gray-400 text-sm">
            AI Productivity Monitor
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm">
            Today
          </div>

          <Link
            to="/history"
            className="bg-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition"
          >
            History
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <SuspicionCard score={score} reason={reason} />

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <h3 className="text-gray-400 text-sm">Active Time</h3>
          <h1 className="text-3xl font-bold mt-2 text-green-400">
            5h 20m
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Today</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <h3 className="text-gray-400 text-sm">Idle Time</h3>
          <h1 className="text-3xl font-bold mt-2 text-yellow-400">
            1h 10m
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Today</p>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="mt-10 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-white text-lg font-semibold mb-4">
          Activity Overview
        </h2>

        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition transform hover:scale-[1.01]">
          <ActivityChart />
        </div>
      </div>

      {/* Heatmap */}
      <div className="mt-10 bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Activity Heatmap
        </h2>

        <ActivityHeatmap />
      </div>

    </div>
  );
};

export default Dashboard;