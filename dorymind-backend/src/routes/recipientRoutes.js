const express = require('express');
const { setRecipientNumber,getRecipientNumber } = require('../controllers/recipientController');

const auth = require('../middleware/auth');

const router = express.Router();

// Simpan atau update nomor penerima
router.post('/', auth, setRecipientNumber);

// Ambil nomor penerima milik user login
router.get('/', auth, getRecipientNumber);



module.exports = router;
