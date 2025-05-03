const express = require('express');
const Annonce = require('../models/Annonce');
const { auth, isAdmin, isSupervisorOrAdmin } = require('../middlewares/auth');
const router = express.Router();

// Get all announcements (public)
router.get('/', async (req, res) => {
  try {
    const { categorie, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (categorie) {
      query.categorie = categorie;
    }

    if (search) {
      query.$or = [
        { titre: { $regex: search, $options: 'i' } },
        { contenu: { $regex: search, $options: 'i' } }
      ];
    }

    const annonces = await Annonce.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Annonce.countDocuments(query);

    res.json({
      annonces,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement (admin only)
router.post('/', auth, isSupervisorOrAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const annonce = new Annonce(req.body);
    await annonce.save();
    res.status(201).json(annonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update announcement (admin only)
router.put('/:id', auth, isSupervisorOrAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const annonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!annonce) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(annonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete announcement (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const annonce = await Annonce.findByIdAndDelete(req.params.id);
    
    if (!annonce) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
