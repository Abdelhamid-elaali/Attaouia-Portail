const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middlewares/auth');
const {
  subscribe,
  unsubscribe,
  getAbonnes
} = require('../controllers/abonneController');

// Public routes
router.post('/', subscribe);
router.delete('/unsubscribe', unsubscribe);

// Admin routes
router.get('/', auth, isAdmin, getAbonnes);

module.exports = router;
