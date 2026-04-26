import { supabase } from "./supabaseClient";

export const analyzeFromAPI = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  const res = await fetch("http://127.0.0.1:8000/analyze", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};