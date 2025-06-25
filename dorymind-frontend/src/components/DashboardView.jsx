import { useEffect, useState } from "react";

const DashboardView = () => {
  const [user, setUser] = useState({ username: "Guest" });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user"); // Hapus jika invalid
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user"); // Hapus jika error
    }
  }, []);

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">Halo, {user.username}</h2>
      
    </div>
  );
};

export default DashboardView;
