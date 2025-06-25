import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const exp = localStorage.getItem("tokenExp");
      if (!exp) return;

      const now = Math.floor(Date.now() / 1000);
      if (now >= parseInt(exp)) {
        // Token expired
        console.warn("Token expired. Logging out...");
        localStorage.clear(); // bersihin semua data
        navigate("/login");
      }
    };

    checkTokenExpiration(); // cek langsung saat komponen mount

    const interval = setInterval(checkTokenExpiration, 30000); // cek tiap 30 detik

    return () => clearInterval(interval);
  }, [navigate]);

  return children;
};

export default AuthWrapper;
