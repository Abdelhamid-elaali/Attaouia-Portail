const Annonce = require('../models/Annonce');

// @desc    Get all announcements
// @route   GET /api/annonces
// @access  Public
exports.getAnnonces = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const categorie = req.query.categorie;

    const query = {};
    if (categorie) {
      query.categorie = categorie;
    }

    const annonces = await Annonce.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Annonce.countDocuments(query);

    res.json({
      annonces,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get single announcement
// @route   GET /api/annonces/:id
// @access  Public
exports.getAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }
    res.json(annonce);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Create announcement
// @route   POST /api/annonces
// @access  Private/Admin
exports.createAnnonce = async (req, res) => {
  try {
    const annonce = new Annonce(req.body);
    await annonce.save();
    res.status(201).json(annonce);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Update announcement
// @route   PUT /api/annonces/:id
// @access  Private/Admin
exports.updateAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }

    const updatedAnnonce = await Annonce.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedAnnonce);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/annonces/:id
// @access  Private/Admin
exports.deleteAnnonce = async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json({ message: 'Annonce non trouvée' });
    }

    await annonce.remove();
    res.json({ message: 'Annonce supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
