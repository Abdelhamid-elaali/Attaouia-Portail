const express = require('express');
const { createSupervisor, getSupervisors } = require('../controllers/userController');
const { auth, isAdmin } = require('../middlewares/auth');

const router = express.Router();

// Create supervisor account (admin only)
router.post('/supervisor', auth, isAdmin, createSupervisor);

// Get all supervisors (admin only)
router.get('/supervisors', auth, isAdmin, getSupervisors);

module.exports = router;
