const express = require('express');
const {addReminder,getMyReminder,getReminderById,editReminder,deleteReminder} = require('../controllers/reminderController');
const auth = require('../middleware/auth');

const router = express.Router();

// Tambah reminder untuk user login
router.post('/', auth, addReminder);

// Ambil reminder milik user login
router.get('/', auth, getMyReminder);

router.get('/:id', auth, getReminderById);

// Update reminder milik user login
router.put('/:id', auth, editReminder);

// Hapus reminder milik user login
router.delete('/:id', auth, deleteReminder);

module.exports = router;
