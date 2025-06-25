const Jadwal = require('../models/Jadwal');

// ✅ Tambah jadwal (multi jadwal per user)
exports.addJadwal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hari, mataKuliah, jamKuliah, ruang } = req.body;

    if (!hari || !mataKuliah || !jamKuliah || !ruang) {
      return res.status(400).json({ error: "Semua field wajib diisi" });
    }

    const jadwal = await Jadwal.create({
      userId,
      hari,
      mataKuliah,
      jamKuliah,
      ruang
    });

    res.status(201).json({ message: "Jadwal berhasil ditambahkan", jadwal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Ambil semua jadwal milik user login
exports.getAllMyJadwal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jadwalList = await Jadwal.findAll({ where: { userId } });

    res.json(jadwalList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Ambil satu jadwal berdasarkan ID dan user
exports.getJadwalById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const jadwal = await Jadwal.findOne({ where: { jadwalId: id, userId } });

    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan atau bukan milik Anda" });
    }

    res.json(jadwal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Edit salah satu jadwal milik user
exports.editJadwal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { hari, mataKuliah, jamKuliah, ruang } = req.body;

    const jadwal = await Jadwal.findOne({ where: { jadwalId: id, userId } });
    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan atau bukan milik Anda" });
    }

    await jadwal.update({ hari, mataKuliah, jamKuliah, ruang });

    res.json({ message: "Jadwal berhasil diperbarui", jadwal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Hapus salah satu jadwal milik user
exports.deleteJadwal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const jadwal = await Jadwal.findOne({ where: { jadwalId: id, userId } });
    if (!jadwal) {
      return res.status(404).json({ message: "Jadwal tidak ditemukan atau bukan milik Anda" });
    }

    await jadwal.destroy();

    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
