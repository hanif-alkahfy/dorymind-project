import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReminderForm from "../components/ReminderForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const EditReminderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/reminders/${id}`;
  const [reminderData, setReminderData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReminder = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setReminderData(data);
      } catch (error) {
        console.error("Gagal mengambil data reminder:", error);
        showErrorToast("Gagal mengambil data reminder");
        navigate("/dashboard/reminders");
      }
    };
    fetchReminder();
  }, [id]);

  const handleUpdateReminder = async (updatedReminder) => {
    try {
      await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReminder),
      });
      // showSuccessToast("Alert berhasil diperbarui!");
      navigate("/dashboard/reminders");
    } catch (error) {
      console.error("Gagal update reminder:", error);
      showErrorToast("Gagal memperbarui reminder");
    }
  };

  return <ReminderForm reminderData={reminderData} onSubmit={handleUpdateReminder} onBack={() => navigate("/dashboard/reminders")} />;
};

export default EditReminderPage;
