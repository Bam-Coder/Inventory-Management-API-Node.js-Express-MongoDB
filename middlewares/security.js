// middlewares/security.js
// Middleware de sécurité (headers, protection XSS, etc.)

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite par IP
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting plus strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuration Helmet pour la sécurité
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Middleware de sécurité complet
const securityMiddleware = [
  // Compression des réponses
  compression(),
  
  // Headers de sécurité
  helmetConfig,
  
  // Protection contre les injections MongoDB
  mongoSanitize(),
  
  // Protection contre les attaques XSS
  xss(),
  
  // Rate limiting général
  limiter,
];

module.exports = {
  securityMiddleware,
  authLimiter,
  limiter
}; 