const Recipient = require('../models/Recipient');

// 🔄 Simpan atau Update nomor WA
exports.setRecipientNumber = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { phoneNumber, type } = req.body;

    if (!phoneNumber || !type) {
      return res.status(400).json({ message: "Nomor dan tipe bot wajib diisi" });
    }

    // Cek apakah user sudah punya nomor
    const existing = await Recipient.findOne({ where: { userId } });

    if (existing) {
      // Update nomor dan type
      await existing.update({ phoneNumber, type });
      return res.json({ message: "Nomor berhasil diperbarui", recipient: existing });
    }

    // Simpan nomor baru
    const recipient = await Recipient.create({ userId, phoneNumber, type });
    res.status(201).json({ message: "Nomor berhasil disimpan", recipient });

  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan nomor", error: error.message });
  }
};

// 📥 Ambil nomor WA milik user
exports.getRecipientNumber = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipient = await Recipient.findOne({ where: { userId } });

    if (!recipient) {
      return res.status(404).json({ message: "Nomor belum disetel" });
    }

    res.json({
      phoneNumber: recipient.phoneNumber,
      type: recipient.type
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil nomor", error: error.message });
  }
};
