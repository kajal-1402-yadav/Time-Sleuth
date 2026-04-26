import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SuspicionCard from "../components/SuspicionCard";

import { analyzeFromAPI } from "../lib/apiService";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../lib/authService";

type Session = {
  id?: string;
  start_time: string;
  end_time: string | null;
  type: "work" | "break";
};

type Summary = {
  start: string | null;
  end: string | null;
  worked: number;
  break: number;
  idle: number;
};

const Dashboard = () => {
  const [score, setScore] = useState(0);
  const [reason, setReason] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const navigate = useNavigate();

  // 🔄 LOAD SESSIONS
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("work_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("start_time", { ascending: true });

        setSessions(data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadSessions();
    const interval = setInterval(loadSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔐 LOGOUT
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🤖 ANALYSIS
  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const result = await analyzeFromAPI();
        if (result) {
          setScore(result.suspicion_score);
          setReason(result.reason);
        }
      } catch { /* empty */ }
    };

    runAnalysis();
    const interval = setInterval(runAnalysis, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 SUMMARY LOGIC
  const calculateSummary = (sessions: Session[]): Summary => {
    if (sessions.length === 0) {
      return { start: null, end: null, worked: 0, break: 0, idle: 0 };
    }

    let worked = 0;
    let breakTime = 0;
    let idle = 0;

    const start = sessions[0].start_time;
    const last = sessions[sessions.length - 1];
    const end = last.end_time || new Date().toISOString();

    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i];

      const startMs = new Date(s.start_time).getTime();
      const endMs = s.end_time
        ? new Date(s.end_time).getTime()
        : currentTime;

      const diff = endMs - startMs;

      if (s.type === "work") worked += diff;
      else breakTime += diff;

      // idle = gap between sessions
      if (i > 0) {
        const prev = sessions[i - 1];
        if (prev.end_time) {
          const gap =
            new Date(s.start_time).getTime() -
            new Date(prev.end_time).getTime();

          if (gap > 0) idle += gap;
        }
      }
    }

    return { start, end, worked, break: breakTime, idle };
  };

  const summary = calculateSummary(sessions);

  const formatDuration = (ms: number) => {
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}h ${m}m`;
  };

  const activeSession = sessions.find((s) => !s.end_time);
  const isFinished =
    sessions.length > 0 &&
    sessions[sessions.length - 1].end_time !== null &&
    !activeSession;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold">Time Sleuth</h1>
          <p className="text-gray-400 text-sm">AI Productivity Monitor</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm">Today</div>

          <Link to="/history" className="bg-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-600">
            History
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔴 LIVE / FINISHED STATUS */}
      {activeSession ? (
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6">
          <p className="text-green-400 font-semibold">
            {activeSession.type === "work" ? "Working Now" : "On Break"}
          </p>
          <p className="text-sm text-gray-400">
            Started at{" "}
            {new Date(activeSession.start_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      ) : isFinished ? (
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl mb-6">
          <p className="text-blue-400 font-semibold">Day Finished</p>
          <p className="text-sm text-gray-400">
            {summary.start &&
              `Started at ${new Date(summary.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}{" "}
            •{" "}
            {summary.end &&
              `Finished at ${new Date(summary.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`}
          </p>
        </div>
      ) : null}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <SuspicionCard score={score} reason={reason} />

        <div className="bg-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Worked Time</p>
          <h2 className="text-xl font-bold mt-2 text-green-400">
            {formatDuration(summary.worked)}
          </h2>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Break Time</p>
          <h2 className="text-xl font-bold mt-2 text-yellow-400">
            {formatDuration(summary.break)}
          </h2>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm">Idle Time</p>
          <h2 className="text-xl font-bold mt-2 text-orange-400">
            {formatDuration(summary.idle)}
          </h2>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;