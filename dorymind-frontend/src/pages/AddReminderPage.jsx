import { useNavigate } from "react-router-dom";
import ReminderForm from "../components/ReminderForm";

const AddReminderPage = () => {
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/reminders`;
  const token = localStorage.getItem("token");

  const handleAddReminder = async (newReminder) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ auth header
        },
        body: JSON.stringify(newReminder),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menambahkan reminder");
      }

      // Sukses → redirect
      navigate("/dashboard/reminders");

    } catch (err) {
      console.error("❌ Gagal tambah reminder:", err.message);
      // TODO: Tambahkan toast / notifikasi error di UI
    }
  };

  return (
    <ReminderForm
      onSubmit={handleAddReminder}
      onBack={() => navigate("/dashboard/reminders")}
    />
  );
};

export default AddReminderPage;
