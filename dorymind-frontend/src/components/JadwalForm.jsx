import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

const JadwalForm = ({ jadwalData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    mataKuliah: "",
    jamKuliah: "",
    ruang: ""
  });

  useEffect(() => {
    if (jadwalData) {
      setFormData(jadwalData);
    }
  }, [jadwalData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white/30 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl">
      <button 
        onClick={onBack} 
        className="mb-6 flex items-center text-[#01579B] hover:text-[#29B6F6] transition-all duration-300 p-3 rounded-lg self-start"
      >
        <FaArrowLeft className="mr-2 text-lg" /> 
        <span className="text-lg font-semibold"></span>
      </button>

      <h2 className="text-xl font-bold mb-4">{jadwalData ? "Edit Jadwal" : "Tambah Jadwal"}</h2>
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
          name="hari" 
          value={formData.hari} 
          onChange={handleChange} 
          placeholder="Hari" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <input 
          type="time" 
          name="jamKuliah" 
          value={formData.jamKuliah} 
          onChange={handleChange} 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <input 
          type="text" 
          name="ruang" 
          value={formData.ruang} 
          onChange={handleChange} 
          placeholder="Ruang" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-[#81D4FA] hover:bg-[#29B6F6] text-white p-3 rounded-xl transition-all duration-300 shadow-md"
        >
          {jadwalData ? "Update Jadwal" : "Tambah Jadwal"}
        </button>
      </form>
    </div>
  );
};

export default JadwalForm;