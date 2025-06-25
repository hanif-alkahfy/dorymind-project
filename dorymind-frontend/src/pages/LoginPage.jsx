import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ⬅️ tambahkan Link
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/api/auth/login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(API_URL, { email, password });

      if (res.status === 200 && res.data.token && res.data.user) {
        const token = res.data.token;
        const decoded = jwtDecode(token); // dapetin exp (dalam detik)

        localStorage.setItem("token", token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("tokenExp", decoded.exp); // ⬅️ SIMPAN di sini

        onLogin(); // callback
        navigate("/dashboard");
      } else {
        setError("Login gagal: data user tidak ditemukan.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Terjadi kesalahan. Coba lagi nanti.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="backdrop-glass p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-900 text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass"
            required
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        {/* 🔹 Tambahkan link register */}
        <p className="mt-4 text-center text-sm text-gray-700">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
