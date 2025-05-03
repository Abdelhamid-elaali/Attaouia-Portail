const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Accès non autorisé' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Erreur d\'authentification' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
};

const isSupervisorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superviseur')) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Droits superviseur ou administrateur requis.' });
  }
};

module.exports = { auth, isAdmin, isSupervisorOrAdmin };
