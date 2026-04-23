import { supabase } from "./supabaseClient";

export const fetchActivityLogs = async () => {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  return data;
};