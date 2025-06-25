import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";


const Dashboard = ({ onLogout }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gradient-to-bl from-blue-50 to-blue-200 min-h-screen w-screen flex transition-all duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 transition-all duration-300 p-6">
        <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout} />
        <Outlet /> {/* Render halaman dalam dashboard */}
      </div>
    </div>
  );
};

export default Dashboard;
