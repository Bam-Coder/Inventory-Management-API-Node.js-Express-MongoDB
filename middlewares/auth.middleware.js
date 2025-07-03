// middlewares/auth.middleware.js
// Middleware d'authentification (vérifie le token JWT et attache l'utilisateur à la requête)

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Vérifier si le token est présent dans les headers
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification manquant' 
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide - utilisateur non trouvé' 
      });
    }

    // Vérifier si l'utilisateur n'est pas supprimé
    if (user.isDeleted) {
      return res.status(401).json({ 
        success: false,
        message: 'Compte désactivé' 
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expiré' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: 'Erreur d\'authentification',
      error: error.message 
    });
  }
};


const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: 'Accès refusé - Administrateur requis' 
    });
  }
};

module.exports = {
  protect,
  isAdmin,
};