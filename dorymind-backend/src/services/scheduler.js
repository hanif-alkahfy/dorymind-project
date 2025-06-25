const { Op } = require("sequelize");
const User = require("../models/User");
const Reminder = require("../models/Reminder");
const Recipient = require("../models/Recipient");
const Jadwal = require("../models/Jadwal");
const { sendMessage } = require("../services/whatsappBot");

// Ambil reminder yang waktunya tiba dan belum dikirim
const getDueReminders = async () => {
  const now = new Date();

  const reminders = await Reminder.findAll({
    where: {
      reminderTime: { [Op.lte]: now },
      status: "pending",
    },
    include: [{ model: User, attributes: ["id"] }],
  });

  // Tampilkan reminder yang akan dikirim
  if (reminders.length === 0) {
    console.log("✅ Tidak ada reminder yang harus dikirim saat ini.");
  } else {
    console.log(`📌 ${reminders.length} reminder akan dikirim:`);
    reminders.forEach((r, i) => {
      console.log(
        `${i + 1}. Mata Kuliah: ${r.mataKuliah}, Tugas: ${r.tugas}, User ID: ${r.userId}, Kirim pada: ${r.reminderTime}`
      );
    });
  }

  return reminders;
};

// Buat array isi reminder + nomor WA user
const getReminderRecipients = async (reminders) => {
  const result = [];

  for (const reminder of reminders) {
    const recipient = await Recipient.findOne({
      where: { userId: reminder.userId },
    });

    if (!recipient) {
      console.warn(`❗ User ${reminder.userId} belum atur nomor WhatsApp`);
      continue;
    }

    result.push({
      userId: reminder.userId,
      number: recipient.phoneNumber,
      type: recipient.type,
      message: `📌 Reminder Tugas!\n\nMata Kuliah: ${reminder.mataKuliah}\nTugas: ${reminder.tugas}\nDeadline: ${reminder.deadline.toLocaleString()}\n\nDeskripsi: ${reminder.deskripsi || "-"}`
    });
  }

  return result;
};

const processReminderQueue = async () => {
  const reminders = await getDueReminders();
  const recipients = await getReminderRecipients(reminders);

  for (const item of recipients) {
    const { userId, number, message, type } = item;

    try {
      if (type === "custom") {
        await sendMessage(number, message, userId); // kirim pakai bot user
      } else {
        await sendMessage(number, message); // kirim pakai bot default
      }

      // Update status di database
      await Reminder.update(
        {
          status: "sent",
          sentAt: new Date(),
        },
        {
          where: {
            userId,
            status: "pending",
            reminderTime: { [Op.lte]: new Date() },
          },
        }
      );

      console.log(`✅ Reminder dikirim ke ${number}`);
    } catch (err) {
      console.error(`❌ Gagal kirim reminder ke ${number}:`, err.message);
    }
  }
};

// Ambil jadwal yang waktunya tiba dan belum dikirim
const getTodayJadwal = async () => {
  const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long" });

  const jadwals = await Jadwal.findAll({
    where: {
      hari: hariIni,
      isNotified: false // hanya ambil yang belum dikirim
    },
    include: [{ model: User, attributes: ["id"] }],
  });

  if (jadwals.length === 0) {
    console.log(`📅 Tidak ada jadwal kuliah hari ${hariIni}`);
  } else {
    console.log(`📚 Ada ${jadwals.length} jadwal kuliah untuk hari ${hariIni}:`);
    jadwals.forEach((j, i) => {
      console.log(`${i + 1}. Mata Kuliah: ${j.mataKuliah}, Jam: ${j.jamKuliah}, User ID: ${j.userId}`);
    });
  }

  return jadwals;
};

// Cek 10 menit sebelum jadwal kuliah
const is10MinutesBefore = (jamKuliah) => {
  const [jam, menit] = jamKuliah.split(":").map(Number);
  const now = new Date();

  const jadwalDate = new Date();
  jadwalDate.setHours(jam, menit, 0, 0);

  const waktuKirim = new Date(jadwalDate.getTime() - 10 * 60 * 1000); // 10 menit sebelum

  return now >= waktuKirim && now < jadwalDate;
};

// Ambil jadwal + nomor WA user
const getJadwalRecipients = async (jadwalList) => {
  const result = [];

  for (const jadwal of jadwalList) {
    if (!is10MinutesBefore(jadwal.jamKuliah)) continue;

    const recipient = await Recipient.findOne({ where: { userId: jadwal.userId } });

    if (!recipient) {
      console.warn(`❗ User ${jadwal.userId} belum atur nomor WhatsApp`);
      continue;
    }

    const message = `📚 Pengingat Kuliah Hari Ini!\n\n` +
      `Mata Kuliah: ${jadwal.mataKuliah}\n` +
      `Jam: ${jadwal.jamKuliah}\n` +
      `Ruang: ${jadwal.ruang}\n` +
      `Hari: ${jadwal.hari}\n\n` +
      `Jangan sampai telat ya!`;

    result.push({
      id: jadwal.jadwalId, // ← ini penting
      userId: jadwal.userId,
      number: recipient.phoneNumber,
      type: recipient.type,
      message,
    });
  }

  return result;
};

// Proses pengiriman jadwal
const processJadwalQueue = async () => {
  const jadwalList = await getTodayJadwal();
  const recipients = await getJadwalRecipients(jadwalList);

  for (const item of recipients) {
    const { id, userId, number, message, type } = item;

    try {
      if (type === "custom") {
        await sendMessage(number, message, userId);
      } else {
        await sendMessage(number, message);
      }

      // 🔽 Tandai sudah dikirim
      await Jadwal.update({ isNotified: true }, { where: { jadwalId: id } });

      console.log(`✅ Jadwal dikirim ke ${number}`);
    } catch (err) {
      console.error(`❌ Gagal kirim jadwal ke ${number}:`, err.message);
    }
  }
};

// Reset status notifikasi untuk semua jadwal
const resetIsNotified = async () => {
  try {
    await Jadwal.update({ isNotified: false }, { where: {} });
    console.log("🔄 Semua jadwal berhasil di-reset (isNotified = false)");
  } catch (err) {
    console.error("❌ Gagal reset status notifikasi:", err.message);
  }
};

module.exports = {
  getDueReminders,
  getReminderRecipients,
  processReminderQueue,
  getTodayJadwal,
  getJadwalRecipients,
  processJadwalQueue,
  resetIsNotified
};
