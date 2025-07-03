// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');

// Import des middlewares et utilitaires
const connectDB = require('./config/db');
const { securityMiddleware } = require('./middlewares/security');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Configuration des variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares de sécurité
app.use(securityMiddleware);

// Configuration CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
}));

// Logging des requêtes
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Parsing du body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Inventory API is running...',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  });
});

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Inventory API Documentation',
}));

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Inventory Management System API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
  });
});

// Routes API
app.use('/auth', require('./routes/auth.routes'));
app.use('/products', require('./routes/product.routes'));
app.use('/stock', require('./routes/stock.routes'));
app.use('/export', require('./routes/export.routes'));
app.use('/admin', require('./routes/admin.routes'));

// Gestion des routes non trouvées
app.use(notFound);

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`Health check available at http://localhost:${PORT}/health`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

module.exports = app;
