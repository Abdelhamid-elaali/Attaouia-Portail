const Abonne = require('../models/Abonne');

// @desc    Subscribe new user to notifications
// @route   POST /api/abonnes
// @access  Public
exports.subscribe = async (req, res) => {
  try {
    const { email, telephone, preferences } = req.body;

    // Check if at least one contact method is provided
    if (!email && !telephone) {
      return res.status(400).json({
        message: 'Au moins un moyen de contact (email ou téléphone) doit être fourni'
      });
    }

    // Check if subscriber already exists
    let existingAbonne = null;
    if (email) {
      existingAbonne = await Abonne.findOne({ email });
    } else if (telephone) {
      existingAbonne = await Abonne.findOne({ telephone });
    }

    if (existingAbonne) {
      // Update existing subscriber
      existingAbonne.preferences = preferences;
      if (email) existingAbonne.email = email;
      if (telephone) existingAbonne.telephone = telephone;
      existingAbonne.active = true;
      await existingAbonne.save();
      return res.json({ message: 'Préférences mises à jour avec succès' });
    }

    // Create new subscriber
    const abonne = new Abonne({
      email,
      telephone,
      preferences
    });

    await abonne.save();
    res.status(201).json({
      message: 'Inscription aux notifications réussie',
      abonne
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Unsubscribe from notifications
// @route   DELETE /api/abonnes/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res) => {
  try {
    const { email, telephone } = req.body;

    if (!email && !telephone) {
      return res.status(400).json({
        message: 'Email ou numéro de téléphone requis pour se désabonner'
      });
    }

    const query = email ? { email } : { telephone };
    const abonne = await Abonne.findOne(query);

    if (!abonne) {
      return res.status(404).json({
        message: 'Aucun abonnement trouvé avec ces informations'
      });
    }

    abonne.active = false;
    await abonne.save();

    res.json({ message: 'Désabonnement réussi' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get all active subscribers
// @route   GET /api/abonnes
// @access  Private/Admin
exports.getAbonnes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const abonnes = await Abonne.find({ active: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Abonne.countDocuments({ active: true });

    res.json({
      abonnes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
