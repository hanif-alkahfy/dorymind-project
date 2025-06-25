import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ReminderList = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/reminders`;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil reminder");

        const data = await res.json();
        setReminders(data);
      } catch (error) {
        console.error("Error fetching reminders:", error.message);
      }
    };

    fetchReminders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal menghapus reminder");

      // Filter dari state
      setReminders((prev) => prev.filter((r) => r.reminderId !== id));
    } catch (error) {
      console.error("Error deleting reminder:", error.message);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">🔔 Reminder List</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        {reminders.map((reminder) => (
          <div 
            key={reminder.reminderId} 
            className={`bg-white/50 backdrop-blur-md shadow-lg p-4 rounded-xl flex justify-between items-center 
            ${reminder.status === "sent" ? "border-l-5 border-red-300" : "border-l-5 border-green-300"}`}
          >        
            <div>
              <h3 className="text-lg font-semibold">{reminder.mataKuliah}</h3>
              <p>{reminder.tugas}</p>
              <p className="text-sm text-gray-500">📅 {new Date(reminder.deadline).toLocaleDateString("id-ID")}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/dashboard/edit-reminder/${reminder.reminderId}`)} 
                className="bg-[#FBC02D] text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-[#F9A825] shadow-md"
              >
                <FaEdit className="mr-0" />
              </button>
              <button 
                onClick={() => handleDelete(reminder.reminderId)} 
                className="bg-[#E53935] text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-[#D32F2F] shadow-md"
              >
                <FaTrash className="mr-0" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderList;
  