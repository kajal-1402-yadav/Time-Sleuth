import { supabase } from "./supabaseClient";

export const fetchHistory = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
};