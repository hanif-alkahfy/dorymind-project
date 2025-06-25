const express = require('express');
const { registerUser, loginUser, editUser } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/edit', auth, editUser);

module.exports = router;
