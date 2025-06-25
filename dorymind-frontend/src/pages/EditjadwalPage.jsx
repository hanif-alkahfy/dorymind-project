import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import JadwalForm from "../components/JadwalForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const EditJadwalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/api/jadwals/${id}`;
  const [jadwalData, setJadwalData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Tambah token
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil jadwal");
        }

        const data = await response.json();
        setJadwalData(data);
      } catch (error) {
        showErrorToast("Gagal mengambil data jadwal.");
        console.error("Gagal ambil jadwal:", error);
      }
    };

    fetchJadwal();
  }, [id]);

  const handleUpdateJadwal = async (updatedJadwal) => {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Tambah token
        },
        body: JSON.stringify(updatedJadwal),
      });

      if (!response.ok) {
        throw new Error("Update gagal");
      }

      showSuccessToast("Jadwal berhasil diperbarui!");
      navigate("/dashboard/jadwal");
    } catch (error) {
      showErrorToast("Gagal update jadwal.");
      console.error("Gagal update:", error);
    }
  };

  return (
    <JadwalForm
      jadwalData={jadwalData}
      onSubmit={handleUpdateJadwal}
      onBack={() => navigate("/dashboard/jadwal")}
    />
  );
};

export default EditJadwalPage;
