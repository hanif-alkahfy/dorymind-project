const { initDefaultBot, initUserBot, resetUserSession, sendMessage } = require("../services/whatsappBot");

// --- INISIALISASI BOT DEFAULT ---
exports.initDefault = (req, res) => {
  try {
    initDefaultBot();
    res.json({ message: "Inisialisasi bot default dimulai" });
  } catch (err) {
    console.error("❌ Gagal inisialisasi bot default:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- INISIALISASI BOT USER (pakai JWT) ---
exports.initUserBot = (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID tidak ditemukan di token" });
  }

  try {
    initUserBot(userId);
    res.json({ message: `Inisialisasi bot untuk user ${userId} dimulai` });
  } catch (err) {
    console.error(`❌ Gagal inisialisasi bot user ${userId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- RESET SESSION BOT USER ---
exports.resetUserBotSession = (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID tidak ditemukan di token" });
  }

  try {
    const success = resetUserSession(userId);
    if (!success) {
      return res.status(500).json({ error: "Gagal reset session bot user" });
    }

    res.json({ message: `✅ Session bot untuk user ${userId} berhasil direset` });
  } catch (err) {
    console.error(`❌ Error reset session bot user ${userId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- KIRIM PESAN DENGAN BOT DEFAULT ---
exports.sendDefaultMessage = async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: "Nomor dan pesan wajib diisi" });
  }

  try {
    await sendMessage(number, message);
    res.json({ message: `✅ Pesan berhasil dikirim ke ${number}` });
  } catch (err) {
    console.error("❌ Gagal kirim pesan:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- KIRIM PESAN DENGAN BOT USER (pakai userId dari JWT juga opsional) ---
exports.sendUserMessage = async (req, res) => {
  const { number, message } = req.body;
  const userId = req.user?.userId || req.body.userId; // fallback kalau belum pakai auth di route

  if (!userId || !number || !message) {
    return res.status(400).json({ error: "userId, nomor, dan pesan wajib diisi" });
  }

  try {
    await sendMessage(number, message, userId);
    res.json({ message: `✅ Pesan berhasil dikirim ke ${number} via user ${userId}` });
  } catch (err) {
    console.error(`❌ Gagal kirim pesan via user ${userId}:`, err.message);
    res.status(500).json({ error: err.message });
  }
};
