// middlewares/errorHandler.js
// Middleware de gestion globale des erreurs (attrape et gère les erreurs de l'application)

const logger = require('../utils/logger');

// Classe d'erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Gestionnaire d'erreurs pour les erreurs MongoDB
const handleCastErrorDB = err => {
  const message = `ID invalide: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valeur dupliquée: ${value}. Veuillez utiliser une autre valeur.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Données invalides. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Token invalide. Veuillez vous reconnecter.', 401);

const handleJWTExpiredError = () => new AppError('Token expiré. Veuillez vous reconnecter.', 401);

// Gestionnaire d'erreurs principal
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erreurs MongoDB
  if (err.name === 'CastError') error = handleCastErrorDB(error);
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Réponse d'erreur
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  // Erreurs de programmation ou inconnues
  logger.error('Erreur inattendue:', err);
  
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Erreur interne du serveur'
  });
};

// Gestionnaire pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new AppError(`Route non trouvée: ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  AppError,
  errorHandler,
  notFound
}; 