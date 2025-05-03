const express = require('express');
const { login, getCurrentUser } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');
const router = express.Router();

// Login route
router.post('/login', login);

// Get current user
router.get('/me', auth, getCurrentUser);
module.exports = router;
