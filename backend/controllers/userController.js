const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Create a new supervisor account
// @route   POST /api/users/supervisor
// @access  Private/Admin
exports.createSupervisor = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { email, password, fullName } = req.body;

    // Validate required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({ 
        message: 'Tous les champs sont obligatoires' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Create new supervisor
    console.log('Creating new supervisor with data:', { email, fullName, role: 'superviseur' });
    const supervisor = new User({
      email,
      password,
      fullName,
      role: 'superviseur'
    });

    console.log('Saving supervisor to database...');
    await supervisor.save();
    console.log('Supervisor saved successfully with ID:', supervisor._id);

    res.status(201).json({
      message: 'Compte superviseur créé avec succès',
      supervisor: {
        id: supervisor._id,
        email: supervisor.email,
        fullName: supervisor.fullName,
        role: supervisor.role
      }
    });
  } catch (error) {
    console.error('Error creating supervisor:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides. Vérifiez tous les champs.' 
      });
    }
    res.status(500).json({ 
      message: 'Erreur lors de la création du compte superviseur' 
    });
  }
};

// @desc    Get all supervisors
// @route   GET /api/users/supervisors
// @access  Private/Admin
exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'superviseur' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(supervisors);
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des superviseurs' });
  }
};
