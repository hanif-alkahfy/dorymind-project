import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";

const Profile = ({ userData, onUpdate, onBack }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        email: userData.email || "",
        password: "", // Password tetap kosong untuk keamanan
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({
      username: formData.username,
      email: formData.email,
      password: formData.password || undefined, // Jangan kirim password jika kosong
    });
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

      <h2 className="text-2xl font-bold text-[#01579B] mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          name="username" 
          value={formData.username} 
          onChange={handleChange} 
          placeholder="Username" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]"
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="Email" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]"
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="New Password" 
          className="w-full p-3 border border-white/30 bg-white/40 backdrop-blur-lg rounded-lg outline-none focus:ring-2 focus:ring-[#81D4FA]"
        />

        <button 
          type="submit" 
          className="w-full bg-[#81D4FA] hover:bg-[#29B6F6] text-white p-3 rounded-xl transition-all duration-300 shadow-md"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
