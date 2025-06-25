import { useNavigate } from "react-router-dom";
import JadwalForm from "../components/JadwalForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const AddJadwalPage = () => {
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/api/jadwals`;
  const token = localStorage.getItem("token");

  const handleAddJadwal = async (newJadwal) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ kirim token JWT
        },
        body: JSON.stringify(newJadwal),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal menambahkan jadwal");
      }

      // showSuccessToast("Jadwal berhasil ditambahkan!");
      navigate("/dashboard/jadwal");
    } catch (error) {
      console.error("Error tambah jadwal:", error.message);
      // showErrorToast(error.message);
    }
  };

  return (
    <JadwalForm
      onSubmit={handleAddJadwal}
      onBack={() => navigate("/dashboard/jadwal")}
      jadwalData={null}
    />
  );
};

export default AddJadwalPage;
