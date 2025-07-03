// middlewares/role.middleware.js
// Middleware de gestion des rôles (vérifie les autorisations selon le rôle de l'utilisateur)

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Vous n\'avez pas les permissions nécessaires pour cette action' 
      });
    }
    next();
  };
};

module.exports = { restrictTo };
