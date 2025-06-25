require("dotenv").config();

const express = require('express');
const cors = require('cors');
const cron = require("node-cron");
const { sequelize } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');
const jadwalRoutes = require('./src/routes/jadwalRoutes');
const whatsappRoutes = require("./src/routes/whatsappRoutes");
const recipientRoutes = require('./src/routes/recipientRoutes');
const scheduler = require('./src/services/scheduler');
const { initDefaultBot, initUserBot } = require('./src/services/whatsappBot');
const  loggedInBots = require('./src/data/loggedInBots.json');
const { resetIsNotified } = require('./src/services/scheduler');

const app = express();
app.use(express.json());
app.use(cors());

setTimeout(() => {
  console.log("⏳ Inisialisasi bot WhatsApp otomatis setelah 15 detik...");
  // initDefaultBot();

  // Inisialisasi ulang semua user yang sudah login
  for (const userId in loggedInBots) {
    // initUserBot(userId);
  }
}, 15000);

// Jalankan scheduler setiap 1 menit
setInterval(() => {
  scheduler.processReminderQueue();
}, 60 * 1000); // 60 detik

// Jalankan scheduler jadwal
setInterval(() => {
  scheduler.processJadwalQueue();
}, 60 * 1000);

// Reset status notifikasi setiap hari pada jam 00:00
cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Menjalankan reset notifikasi harian...");
  await resetIsNotified();
}, {
  timezone: "Asia/Jakarta",
});

app.use("/api/whatsapp", whatsappRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/jadwals', jadwalRoutes);
app.use('/api/recipients', recipientRoutes);

(async () => {
  try {
    await sequelize.sync({ force: false, alter: true });
    console.log("Sync database berhasil !!");
  } catch (err) {
    console.error("Gagal sync database atau trigger", err);
  }
})();

module.exports = app;
