import { supabase } from "./supabaseClient";

export const fetchAnalysisHistory = async () => {
  const { data, error } = await supabase
    .from("analysis_results")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching history:", error);
    return [];
  }

  return data;
};