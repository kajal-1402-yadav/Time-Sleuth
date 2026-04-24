import { useState } from "react";
import { signIn } from "../lib/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { error } = await signIn(email, password);

    if (!error) {
      navigate("/");
    } else {
      setErrorMsg(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-6">

      {/* Login Card */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2 text-center">
          Time Sleuth
        </h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Employee Login
        </p>

        {errorMsg && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {errorMsg}
          </p>
        )}

        {/* Inputs */}
        <input
          className="w-full p-3 mb-3 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 p-3 rounded-lg hover:bg-blue-600 transition font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;