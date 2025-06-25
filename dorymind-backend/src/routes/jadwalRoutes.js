const express = require('express');
const {addJadwal,getAllMyJadwal,getJadwalById,editJadwal,deleteJadwal} = require('../controllers/jadwalController');

const auth = require('../middleware/auth');

const router = express.Router();

// Tambah jadwal
router.post('/', auth, addJadwal);

// Ambil semua jadwal milik user login
router.get('/', auth, getAllMyJadwal);

router.get('/:id', auth, getJadwalById);

// Edit jadwal tertentu milik user (pakai jadwalId)
router.put('/:id', auth, editJadwal);

// Hapus jadwal tertentu milik user
router.delete('/:id', auth, deleteJadwal);

module.exports = router;
