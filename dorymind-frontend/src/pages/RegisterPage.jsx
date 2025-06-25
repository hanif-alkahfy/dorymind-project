import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/auth/register`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(API_URL, { username, email, password });

      // ✅ Terima status 200 atau 201
      if ((res.status === 200 || res.status === 201) && res.data.message) {
        setSuccess("Registrasi berhasil! Silakan login.");
        setTimeout(() => navigate("/"), 2000); // Redirect ke login
      } else {
        setError("Registrasi gagal.");
      }
    } catch (err) {
      console.error("Register error:", err);
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
        <h2 className="text-2xl font-semibold text-blue-900 text-center mb-6">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-glass"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass"
            required
          />
          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
