import { supabase } from "./supabaseClient";

type ActivityLog = {
  id: string;
  user_id: string;
  timestamp: string;
  mouse_moves: number;
  clicks: number;
  keystrokes: number;
  idle_time: number;
};

export const analyzeActivity = async () => {
  const today = new Date().toISOString().split("T")[0];

  // 🔐 get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("No authenticated user");
    return;
  }

  const { data: logs, error } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id) // ✅ filter by user
    .gte("timestamp", today);

  if (error || !logs) {
    console.error(error);
    return;
  }

  const typedLogs = logs as ActivityLog[];

  let totalIdle = 0;
  let totalActivity = 0;

  let idleStreak = 0;
  let maxIdleStreak = 0;
  let spikeDetected = false;

  typedLogs.forEach((log, index) => {
    const activity =
      log.mouse_moves + log.clicks + log.keystrokes;

    totalActivity += activity;
    totalIdle += log.idle_time;

    // 🟡 idle streak
    if (log.idle_time > 10) {
      idleStreak++;
      maxIdleStreak = Math.max(maxIdleStreak, idleStreak);
    } else {
      idleStreak = 0;
    }

    // 🔴 spike detection
    if (
      index > 0 &&
      typedLogs[index - 1].idle_time > 10 &&
      activity > 200
    ) {
      spikeDetected = true;
    }
  });

  // 🧠 scoring
  let score =
    totalIdle * 1.5 +
    maxIdleStreak * 10 +
    (spikeDetected ? 20 : 0) -
    totalActivity * 0.05;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // 🧠 reasoning
  let reason = "Normal activity pattern";

  if (spikeDetected) {
    reason = "Suspicious spike after idle detected";
  } else if (maxIdleStreak >= 3) {
    reason = "Repeated long idle periods";
  } else if (totalIdle > 60) {
    reason = "High overall idle time";
  } else if (score > 40) {
    reason = "Moderate inconsistency in activity";
  }

  const result = {
    user_id: user.id, // 🔥 real user
    date: today,
    suspicion_score: score,
    anomaly_flag: score > 60,
    reason,
  };

  const { error: insertError } = await supabase
    .from("analysis_results")
    .upsert([result], {
      onConflict: "user_id,date",
    });

  if (insertError) {
    console.error("Insert error:", insertError);
  }

  return {
    ...result,
    maxIdleStreak,
    spikeDetected,
  };
};