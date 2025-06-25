import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

const API_BASE = `${import.meta.env.VITE_BASE_API_URL}api`;
const API_BASE_IO = `${import.meta.env.VITE_BASE_API_URL}`;
const socket = io(API_BASE_IO);

const SetUpBot = () => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  const [botType, setBotType] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrData, setQrData] = useState("");
  const [botStatus, setBotStatus] = useState("Belum Terhubung");
  const [notif, setNotif] = useState("");
  const [isBotReady, setIsBotReady] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [hasBotSetup, setHasBotSetup] = useState(false);

  // Ambil user dari localStorage saat pertama kali
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    if (storedUser?.id && storedToken) {
      setUserId(storedUser.id);
      setToken(storedToken);
    }
  }, []);

  // Setelah userId dan token siap, fetch status & socket listener
  useEffect(() => {
    if (!userId || !token) return;

    fetchInitialStatus();

    socket.on("connect", () => {
      console.log("🔌 Socket terhubung:", socket.id);
    });

    socket.on(`qr-user-${userId}`, (data) => {
      setQrData(data);
      setBotStatus("Menunggu scan QR...");
    });

    socket.on(`ready-user-${userId}`, () => {
      setBotStatus("Tersambung");
      setIsBotReady(true);
    });

    return () => {
      socket.off(`qr-user-${userId}`);
      socket.off(`ready-user-${userId}`);
    };
  }, [userId, token]);

  const fetchInitialStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/recipients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.phoneNumber) {
          setPhoneNumber(data.phoneNumber);
          setBotType(data.type);
          setShowPhoneForm(false);
          setIsBotReady(true);
          setBotStatus("Tersambung");
          setIsUpdate(true);
          setHasBotSetup(true);
        }
      }
    } catch (err) {
      console.error("Gagal ambil data penerima:", err.message);
    }
  };

  const handleGenerateQR = async () => {
    setNotif("");
    setQrData("");
    setBotStatus("Menunggu QR...");
    setIsBotReady(false);

    try {
      await fetch(`${API_BASE}/whatsapp/init-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      setNotif("❌ Gagal generate QR");
    }
  };

  const handleSave = async () => {
    setNotif("");
    if (!phoneNumber) return setNotif("❌ Nomor WA tidak boleh kosong");

    try {
      const res = await fetch(`${API_BASE}/recipients`, {
        method: isUpdate ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber, type: botType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal simpan nomor");

      setNotif("✅ Nomor berhasil disimpan");
      setIsUpdate(true);
      fetchInitialStatus();
    } catch (err) {
      setNotif("❌ " + err.message);
    }
  };

  const handleUpdateBot = async () => {
    setNotif("⏳ Menghapus session lama...");

    try {
      const res = await fetch(`${API_BASE}/whatsapp/reset-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Gagal reset session");

      setNotif("✅ Session lama dihapus. Menginisialisasi bot baru...");
      setQrData("");
      setBotStatus("Menunggu QR...");
      setIsBotReady(false);

      await fetch(`${API_BASE}/whatsapp/init-user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowPhoneForm(false);
      setQrData("");
    } catch (err) {
      setNotif("❌ " + err.message);
    }
  };

  const handleReset = () => {
    setBotType(null);
    setPhoneNumber("");
    setQrData("");
    setBotStatus("Belum Terhubung");
    setNotif("");
    setIsBotReady(false);
    setShowPhoneForm(false);
    setIsUpdate(false);
    setHasBotSetup(false);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Setup WhatsApp Bot</h1>

        {!botType && !hasBotSetup && (
          <div className="grid gap-4">
            <button
              className="bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-all"
              onClick={() => {
                setBotType("default");
                setShowPhoneForm(true);
              }}
            >
              🚀 Gunakan Bot Default
            </button>

            <button
              className="bg-green-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-green-700 transition-all"
              onClick={() => {
                setBotType("custom");
                handleGenerateQR();
              }}
            >
              🤖 Gunakan Bot Sendiri
            </button>
          </div>
        )}

        {hasBotSetup && (
          <div className="grid gap-4 mb-6">
            <p className="text-center text-sm text-gray-600">
              <strong>Bot:</strong> {botType} <br />
              <strong>Nomor:</strong> {phoneNumber}
            </p>

            <button
              className="bg-yellow-500 text-white font-medium py-3 px-4 rounded-xl hover:bg-yellow-600 transition-all"
              onClick={handleUpdateBot}
            >
              ♻️ Update Bot
            </button>

            <button
              className="bg-blue-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-blue-700 transition-all"
              onClick={() => setShowPhoneForm(true)}
            >
              📲 Update Nomor
            </button>
          </div>
        )}

        {botType === "custom" && !showPhoneForm && !hasBotSetup && (
          <div className="mt-6 text-center">
            <p className="text-sm mb-2">
              <span className="font-semibold text-gray-700">Status Bot:</span>{" "}
              {botStatus === "Tersambung" ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" /> {botStatus}
                </span>
              ) : botStatus.includes("QR") ? (
                <span className="inline-flex items-center gap-1 text-yellow-600">
                  <Loader2 className="w-4 h-4 animate-spin" /> {botStatus}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <XCircle className="w-4 h-4" /> {botStatus}
                </span>
              )}
            </p>

            {qrData ? (
              <div className="bg-gray-100 p-4 rounded-lg inline-block mt-4">
                <QRCode value={qrData} size={200} />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4">⏳ Menunggu QR Code...</p>
            )}

            {isBotReady && (
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all"
                onClick={() => setShowPhoneForm(true)}
              >
                ✅ Lanjutkan
              </button>
            )}

            <button
              className="mt-4 text-sm text-blue-600 underline hover:text-blue-800 transition-all"
              onClick={handleReset}
            >
              ← Kembali
            </button>
          </div>
        )}

        {showPhoneForm && (
          <div className="mt-8">
            <label className="block font-medium text-gray-700 mb-1">Nomor WhatsApp Tujuan</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Contoh: 6281234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <button
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all"
              onClick={handleSave}
            >
              {isUpdate ? "🔄 Update Nomor" : "💾 Simpan Nomor"}
            </button>

            <button
              className="mt-4 text-sm text-blue-600 underline hover:text-blue-800 transition-all"
              onClick={handleReset}
            >
              ← Kembali
            </button>
          </div>
        )}

        {notif && (
          <p className="mt-6 text-center text-sm font-medium text-gray-700">{notif}</p>
        )}
      </div>
    </div>
  );
};

export default SetUpBot;
