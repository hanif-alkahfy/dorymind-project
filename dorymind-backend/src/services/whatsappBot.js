const { Client, LocalAuth } = require("whatsapp-web.js");
const { getIO} = require("../config/socket");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

let defaultClient;
const userClients = {}; // Simpan instance bot per userId

const loggedInPath = path.join(__dirname, "../data/loggedInBots.json");

let loggedInBots = {};
try {
  if (fs.existsSync(loggedInPath)) {
    const raw = fs.readFileSync(loggedInPath, "utf-8");
    const parsed = JSON.parse(raw);

    // Pastikan hasil parse adalah objek dan bukan array/null
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      loggedInBots = parsed;
    } else {
      console.warn("⚠️ Format loggedInBots.json tidak valid. Menggunakan objek kosong.");
    }
  }
} catch (err) {
  console.error("❌ Gagal membaca loggedInBots.json:", err.message);
}


// --- BOT DEFAULT ---
const initDefaultBot = () => {
  if (defaultClient) return;

  defaultClient = new Client({
    authStrategy: new LocalAuth({ clientId: "default" }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  defaultClient.on("qr", (qr) => {
    console.log("🔐 Scan QR untuk login WhatsApp (default):");
    qrcode.generate(qr, { small: true });
  });

  defaultClient.on("ready", () => {
    console.log("✅ WhatsApp bot default siap digunakan!");
  });

  defaultClient.on("authenticated", () => {
    console.log("🔓 Bot default berhasil login");
  });

  defaultClient.on("auth_failure", (msg) => {
    console.error("❌ Bot default gagal login:", msg);
  });

  defaultClient.on("disconnected", (reason) => {
    console.warn("⚠️ Bot default terputus:", reason);
  });

  defaultClient.initialize();
};

// --- BOT USER (CUSTOM) ---
const initUserBot = (userId) => {
  if (!userId || (typeof userId !== 'string' && typeof userId !== 'number')) {
    console.error(`❌ userId tidak valid saat inisialisasi bot:`, userId);
    return null;
  }

  if (userClients[userId]) {
    console.log(`♻️ Bot untuk user ${userId} sudah aktif`);
    return userClients[userId];
  }

  const clientId = `user-${userId}`;
  const client = new Client({
    authStrategy: new LocalAuth({ clientId }),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    console.log(`🔐 Scan QR untuk login WhatsApp user ${userId}:`);
    qrcode.generate(qr, { small: true });
    try {
      const io = getIO();
      io.emit(`qr-user-${userId}`, qr);
    } catch (err) {
      console.error("❌ Gagal emit QR ke frontend:", err.message);
    }
  });

  client.on("ready", () => {
    console.log(`✅ WhatsApp bot user ${userId} siap digunakan!`);

    // Pastikan loggedInBots bertipe object
    if (!loggedInBots || typeof loggedInBots !== "object" || Array.isArray(loggedInBots)) {
      loggedInBots = {};
    }

    loggedInBots[userId] = true;

    try {
      fs.writeFileSync(loggedInPath, JSON.stringify(loggedInBots, null, 2));
    } catch (err) {
      console.error("❌ Gagal menyimpan loggedInBots:", err.message);
    }

    try {
      const io = getIO();
      io.emit(`ready-user-${userId}`);
    } catch (err) {
      console.error("❌ Gagal emit status ready ke frontend:", err.message);
    }
  });

  client.on("authenticated", () => {
    console.log(`🔓 Bot user ${userId} berhasil login`);
  });

  client.on("auth_failure", (msg) => {
    console.error(`❌ Bot user ${userId} gagal login:`, msg);
  });

  client.on("disconnected", (reason) => {
    console.warn(`⚠️ Bot user ${userId} terputus:`, reason);

    delete loggedInBots[userId];
    delete userClients[userId];

    try {
      fs.writeFileSync(loggedInPath, JSON.stringify(loggedInBots, null, 2));
    } catch (err) {
      console.error("❌ Gagal menyimpan loggedInBots setelah disconnect:", err.message);
    }
  });

  client.initialize();
  userClients[userId] = client;

  return client;
};

// --- RESET SESSION ---
const resetUserSession = (userId) => {
  try {
    const sessionDir = path.join(__dirname, ".wwebjs_auth", `user-${userId}`);

    // Hapus session folder
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      console.log(`🧹 Session folder untuk user-${userId} dihapus`);
    }

    // Hentikan client aktif jika ada
    if (userClients[userId]) {
      userClients[userId].destroy();
      delete userClients[userId];
      console.log(`💀 Client WhatsApp user-${userId} dihentikan`);
    }

    // Hapus dari loggedInBots
    if (loggedInBots[userId]) {
      delete loggedInBots[userId];
      fs.writeFileSync(loggedInPath, JSON.stringify(loggedInBots, null, 2));
      console.log(`🗑️ loggedInBots untuk user-${userId} dihapus`);
    }

    return true;
  } catch (err) {
    console.error(`❌ Gagal reset session untuk user-${userId}:`, err.message);
    return false;
  }
};

// --- KIRIM PESAN ---
const sendMessage = async (number, message, userId = null) => {
  let targetClient;

  if (userId) {
    targetClient = userClients[userId];

    if (!targetClient) {
      throw new Error(`Bot user ${userId} belum aktif, tidak bisa kirim pesan`);
    }
  } else {
    targetClient = defaultClient;

    if (!targetClient) {
      throw new Error("Bot default belum diinisialisasi");
    }
  }

  const chatId = number.includes("@c.us") ? number : `${number}@c.us`;
  await targetClient.sendMessage(chatId, message);
};


module.exports = {
  initDefaultBot,
  initUserBot,
  resetUserSession,
  sendMessage,
};
