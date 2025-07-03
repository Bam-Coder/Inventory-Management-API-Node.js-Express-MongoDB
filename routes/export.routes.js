// routes/export.routes.js
// Définition des routes pour l'exportation des données (mapping URL vers contrôleur, gestion des middlewares)

const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { 
  exportProductsToCSV, 
  exportLogsToCSV, 
  exportLowStockToCSV,
  exportInventoryStatsToCSV
} = require('../controllers/export.controller');

// Routes d'export CSV
router.get('/products', protect, exportProductsToCSV);
router.get('/logs', protect, exportLogsToCSV);
router.get('/low-stock', protect, exportLowStockToCSV);
router.get('/stats', protect, exportInventoryStatsToCSV);

module.exports = router; 