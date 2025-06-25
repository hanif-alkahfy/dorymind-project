const Reminder = require('../models/Reminder');
const moment = require("moment-timezone");

// ➕ Tambah reminder (banyak reminder diperbolehkan)
exports.addReminder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mataKuliah, tugas, deskripsi, deadline, reminderTime, attachmentLink } = req.body;

    const reminder = await Reminder.create({
      userId,
      mataKuliah,
      tugas,
      deskripsi,
      deadline,
      reminderTime,
      attachmentLink
    });

    res.status(201).json({ message: 'Reminder berhasil ditambahkan', reminder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 📥 Ambil semua reminder milik user
exports.getMyReminder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const reminders = await Reminder.findAll({ where: { userId } });

    if (reminders.length === 0) return res.status(404).json({ message: "Belum ada reminder" });

    const formatted = reminders.map(reminder => ({
      ...reminder.toJSON(),
      deadline: moment(reminder.deadline).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      reminderTime: moment(reminder.reminderTime).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      createdAt: moment(reminder.createdAt).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(reminder.updatedAt).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil reminder", error });
  }
};

// 📌 Ambil reminder berdasarkan ID & milik user login
exports.getReminderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ where: { reminderId: id, userId } });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder tidak ditemukan" });
    }

    const formatted = {
      ...reminder.toJSON(),
      deadline: moment(reminder.deadline).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      reminderTime: moment(reminder.reminderTime).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      createdAt: moment(reminder.createdAt).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
      updatedAt: moment(reminder.updatedAt).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
    };

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✏️ Edit reminder berdasarkan ID dan userId
exports.editReminder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { mataKuliah, tugas, deskripsi, deadline, reminderTime, attachmentLink } = req.body;

    const reminder = await Reminder.findOne({ where: { reminderId: id, userId } });
    if (!reminder) return res.status(404).json({ message: "Reminder tidak ditemukan" });

    await reminder.update({
      mataKuliah,
      tugas,
      deskripsi,
      deadline,
      reminderTime,
      attachmentLink
    });

    res.json({ message: "Reminder diperbarui", reminder });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ❌ Hapus reminder berdasarkan ID dan userId
exports.deleteReminder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const reminder = await Reminder.findOne({ where: { reminderId: id, userId } });
    if (!reminder) return res.status(404).json({ message: "Reminder tidak ditemukan" });

    await reminder.destroy();
    res.json({ message: "Reminder dihapus" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
