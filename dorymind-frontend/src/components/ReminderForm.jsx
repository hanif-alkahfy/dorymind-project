import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

const ReminderForm = ({ reminderData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    mataKuliah: "",
    tugas: "",
    deskripsi: "",
    deadline: "",
    reminderTime: "",
    attachmentLink: "",
  });

  // Format tanggal agar sesuai dengan input type="date"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dateString.split(" ")[0]; // Ambil hanya YYYY-MM-DD
  };

  // Format datetime agar sesuai dengan input type="datetime-local"
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    return dateTimeString.replace(" ", "T").slice(0, 16); // Ubah spasi menjadi 'T' dan ambil YYYY-MM-DDTHH:mm
  };

  useEffect(() => {
    if (reminderData) {
      setFormData({
        ...reminderData,
        deadline: formatDate(reminderData.deadline),
        reminderTime: formatDateTime(reminderData.reminderTime),
      });
    }
  }, [reminderData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white/30 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl">
      {/* Tombol Kembali */}
      <button 
        onClick={onBack} 
        className="mb-6 flex items-center text-[#01579B] hover:text-[#29B6F6] transition-all duration-300 p-3 rounded-lg self-start"
      >
        <FaArrowLeft className="mr-2 text-lg" /> 
        <span className="text-lg font-semibold"></span>
      </button>

      <h2 className="text-xl font-bold mb-4">{reminderData ? "Edit Reminder" : "Tambah Reminder"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          name="mataKuliah" 
          value={formData.mataKuliah} 
          onChange={handleChange} 
          placeholder="Mata Kuliah" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <input 
          type="text" 
          name="tugas" 
          value={formData.tugas} 
          onChange={handleChange} 
          placeholder="Tugas" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <input 
          type="text" 
          name="deskripsi" 
          value={formData.deskripsi} 
          onChange={handleChange} 
          placeholder="Deskripsi" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        {/* Input Deadline dengan Date Picker */}
        <input 
        type="date" 
        name="deadline" 
        value={formData.deadline} 
        onChange={handleChange} 
        className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
        required 
        />
        {/* Input Reminder Time dengan DateTime Picker */}
        <input 
          type="datetime-local" 
          name="reminderTime" 
          value={formData.reminderTime} 
          onChange={handleChange} 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <input 
          type="text" 
          name="attachmentLink" 
          value={formData.attachmentLink} 
          onChange={handleChange} 
          placeholder="Attachment Link" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-[#81D4FA] hover:bg-[#29B6F6] text-white p-3 rounded-xl transition-all duration-300 shadow-md"
        >
          {reminderData ? "Update Reminder" : "Tambah Reminder"}
        </button>
      </form>
    </div>
  );
};

export default ReminderForm;
