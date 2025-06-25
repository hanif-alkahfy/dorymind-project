import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const JadwalList = () => {
  const navigate = useNavigate();
  const [jadwal, setJadwal] = useState([]);
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/api/jadwals`;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Gagal mengambil data jadwal");

        const data = await response.json();
        setJadwal(data);
      } catch (error) {
        console.error("Error fetching jadwal:", error.message);
      }
    };

    fetchJadwal();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Gagal menghapus jadwal");

      setJadwal(jadwal.filter((item) => item.jadwalId !== id));
    } catch (error) {
      console.error("Gagal menghapus jadwal:", error.message);
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">📅 Jadwal Kuliah</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        {jadwal.map((item) => (
          <div 
            key={item.jadwalId}
            className="bg-white/50 backdrop-blur-md border border-white/30 shadow-lg p-4 rounded-xl flex justify-between items-center border-l-4 border-[#29B6F6]"
          >        
            <div>
              <h3 className="text-lg font-semibold">{item.mataKuliah}</h3>
              <p>📅 {item.hari}</p>
              <p>🕒 {item.jamKuliah}</p>
              <p>🏫 {item.ruang}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/dashboard/edit-jadwal/${item.jadwalId}`)} 
                className="bg-[#FBC02D] text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-[#F9A825] shadow-md"
              >
                <FaEdit className="mr-0" />
              </button>
              <button 
                onClick={() => handleDelete(item.jadwalId)} 
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

export default JadwalList;
