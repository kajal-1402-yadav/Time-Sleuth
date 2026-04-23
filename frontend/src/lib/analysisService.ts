import { supabase } from "./supabaseClient";

export const analyzeActivity = async () => {
  const { data: logs, error } = await supabase
    .from("activity_logs")
    .select("*");

  if (error || !logs) {
    console.error(error);
    return;
  }

  let totalIdle = 0;
  let totalActivity = 0;

  logs.forEach((log: any) => {
    const activity =
      log.mouse_moves + log.clicks + log.keystrokes;

    totalActivity += activity;
    totalIdle += log.idle_time;
  });

  let score = totalIdle * 2 - totalActivity * 0.1;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // AI-like reasoning
  let reason = "Normal activity";

  if (score > 70) {
    reason = "High idle time detected";
  } else if (score > 40) {
    reason = "Moderate inactivity patterns";
  }

  const result = {
    user_id: "demo-user",
    date: new Date().toISOString().split("T")[0],
    suspicion_score: score,
    anomaly_flag: score > 60,
    reason,
  };

  const { error: insertError } = await supabase
    .from("analysis_results")
    .insert([result]);

  if (insertError) {
    console.error("Insert error:", insertError);
  }

  return result;
};