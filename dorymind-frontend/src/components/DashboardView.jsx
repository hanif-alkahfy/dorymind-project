import { useState, useEffect } from "react";

const DashboardView = () => {
  const [jadwalHariIni, setJadwalHariIni] = useState([]);
  const [reminderTerdekat, setReminderTerdekat] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchJadwalFromAPI = async () => {
    // ✅ URL API konsisten JadwalList
    const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/jadwals`;
    const token = localStorage.getItem("token");
    
    console.log("Fetching jadwal from:", API_URL); // Debug log
    
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Response status:", response.status); // Debug log
      
      if (!response.ok) throw new Error("Gagal mengambil data jadwal");
      
      const data = await response.json();
      console.log("Jadwal data:", data); // Debug log
      
      return data;
    } catch (err) {
      console.error("Error fetching jadwal:", err);
      return [];
    }
  };

  const fetchReminderFromAPI = async () => {
    // URL API untuk reminder
    const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/reminders`;
    const token = localStorage.getItem("token");
    
    console.log("Fetching reminders from:", API_URL); // Debug log
    
    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Reminder response status:", response.status); // Debug log
      
      if (!response.ok) throw new Error("Gagal mengambil data reminder");
      
      const data = await response.json();
      console.log("Reminder data:", data); // Debug log
      
      return data;
    } catch (err) {
      console.error("Error fetching reminders:", err);
      return [];
    }
  };

  const getJadwalHariIni = (data) => {
    const today = new Date();
    const todayName = today.toLocaleDateString('id-ID', { weekday: 'long' });
    
    console.log("Today is:", todayName); // Debug log
    console.log("Filtering jadwal for today from:", data); // Debug log
    
    const filtered = data.filter(j => {
      console.log("Comparing:", j.hari?.toLowerCase(), "with", todayName.toLowerCase()); // Debug log
      return j.hari?.toLowerCase() === todayName.toLowerCase();
    });
    
    console.log("Filtered jadwal for today:", filtered); // Debug log
    return filtered;
  };

  const getReminderTerdekat = (data) => {
    const now = new Date();
    const filtered = data
      .filter(r => new Date(r.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
      
    console.log("Filtered upcoming reminders:", filtered); // Debug log
    return filtered;
  };

  useEffect(() => {
    const loadData = async () => {
      console.log("Loading dashboard data..."); // Debug log
      setLoading(true);
      
      const [jadwalData, reminderData] = await Promise.all([
        fetchJadwalFromAPI(), 
        fetchReminderFromAPI()
      ]);
      
      console.log("Raw jadwal data:", jadwalData); // Debug log
      console.log("Raw reminder data:", reminderData); // Debug log
      
      setJadwalHariIni(getJadwalHariIni(jadwalData));
      setReminderTerdekat(getReminderTerdekat(reminderData));
      setLoading(false);
    };
    
    loadData();
  }, []);

  const JadwalCard = ({ jadwal }) => (
    <div className="bg-white/70 backdrop-blur-sm border border-white/50 shadow rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{jadwal.mataKuliah}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 border border-blue-200 px-2 py-1 rounded-full">
          {jadwal.hari}
        </span>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <div>🕒 {jadwal.jamKuliah}</div>
        <div>🏫 {jadwal.ruang}</div>
      </div>
    </div>
  );

  const ReminderCard = ({ reminder }) => (
    <div className={`bg-white/70 backdrop-blur-sm shadow rounded-lg p-4 border-l-4 ${reminder.status === "sent" ? "border-red-400" : "border-green-400"}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{reminder.mataKuliah}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${reminder.status === "sent" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {reminder.status === "sent" ? "Urgent" : "Active"}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{reminder.tugas}</p>
      <div className="text-sm text-orange-600">
        Deadline: {new Date(reminder.deadline).toLocaleDateString("id-ID")}
      </div>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center py-8 text-gray-500">{message}</div>
  );

  const LoadingSpinner = ({ message }) => (
    <div className="text-center py-8">
      <div className="h-10 w-10 border-b-2 border-blue-600 animate-spin rounded-full mx-auto mb-3"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );

  return (
    <div className="w-full mt-10">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">Halo, {user.username}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🔔 Reminder Terdekat */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow">
          <div className="p-6 border-b border-white/30">
            <h2 className="text-xl font-semibold text-[#01579B]">
              🔔 Reminder Terdekat <span className="ml-2 text-sm text-gray-500">({reminderTerdekat.length} tugas)</span>
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <LoadingSpinner message="Memuat reminder..." />
            ) : reminderTerdekat.length === 0 ? (
              <EmptyState message="Tidak ada reminder" />
            ) : (
              <div className="space-y-4">
                {reminderTerdekat.map(r => (
                  <ReminderCard key={r.reminderId} reminder={r} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 📅 Jadwal Hari Ini */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg border border-white/50 shadow">
          <div className="p-6 border-b border-white/30">
            <h2 className="text-xl font-semibold text-[#01579B] ">
              📅 Jadwal Hari Ini <span className="ml-2 text-sm text-gray-500">({jadwalHariIni.length} kelas)</span>
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <LoadingSpinner message="Memuat jadwal..." />
            ) : jadwalHariIni.length === 0 ? (
              <EmptyState message="Tidak ada jadwal hari ini" />
            ) : (
              <div className="space-y-4">
                {jadwalHariIni.map(j => (
                  <JadwalCard key={j.jadwalId} jadwal={j} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;