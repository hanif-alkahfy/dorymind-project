import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import { useEffect, useState } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}api/auth/edit`;

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(API_URL, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const newUserData = { ...user, ...updatedData };
        localStorage.setItem("user", JSON.stringify(newUserData));

        //showSuccessToast("Profile updated successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      //showErrorToast("Error update profile")
    }
  };

  return user ? (
    <Profile userData={user} onBack={() => navigate("/dashboard")} onUpdate={handleUpdateProfile} />
  ) : (
    <p>Loading...</p>
  );
};

export default ProfilePage;
