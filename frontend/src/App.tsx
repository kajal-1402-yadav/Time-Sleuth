import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import { getUser } from "./lib/authService";
import { supabase } from "./lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

function App() {
  // 🔥 undefined = loading state
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getUser();
      setUser(currentUser);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔥 Prevent flicker
  if (user === undefined) {
    return null; // or small loader if you want
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<Login />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;