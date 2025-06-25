import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isOpen, toggleSidebar, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-100/20 backdrop-blur-md border border-white/30 text-[#01579B] px-4 py-5 flex justify-between items-center relative shadow-lg">
      <div className="flex items-center">
        {!isOpen ? (
          <button onClick={toggleSidebar} className="absolute left-4 top-3 text-[#01579B] mt-4">
            <FaBars size={24} />
          </button>
        ) : null}
        <span className={`text-lg font-bold text-[#01579B] transition-all duration-300 ${isOpen ? "ml-10" : "ml-10"}`}>DoryMind</span>
      </div>

      <div className="relative">
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none">
          <img src="/profile.png" alt="Profile" className="w-10 h-10 rounded-full" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-[#01579B] shadow-xl rounded-xl backdrop-blur-lg border border-white/30 transition-all duration-300">
            <button 
              onClick={() => {
                setDropdownOpen(false);
                navigate("/profile");
              }} 
              className="block w-full text-left px-4 py-2 hover:bg-blue-200/40 transition-all duration-200 rounded-lg"
            >
              Profile
            </button>
            <button
              onClick={() => {
                console.log("Logout button clicked"); // Debugging
                setDropdownOpen(false);
                if (onLogout) {
                  onLogout();
                } else {
                  console.error("onLogout is not defined");
                }
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
