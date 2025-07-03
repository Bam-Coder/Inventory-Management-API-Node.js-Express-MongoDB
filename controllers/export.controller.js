// controllers/export.controller.js
// Contrôleur HTTP pour l'exportation des données (reçoit les requêtes, délègue au service)

const exportService = require('../services/export.service');

// Export des produits
const exportProductsToCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await exportService.exportProductsToCSV(userId);
    if (result.error === 'no_data') {
      return res.status(404).json({ success: false, message: `Aucun ${result.filename} à exporter.` });
    }
    res.header('Content-Type', 'text/csv');
    res.attachment(result.filename);
    res.send(result.csv);
  } catch (error) {
    res.status(500).json({ success: false, message: `Erreur export CSV products_export.csv`, error: error.message });
  }
};

// Export des logs de stock
const exportLogsToCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await exportService.exportLogsToCSV(userId);
    if (result.error === 'no_data') {
      return res.status(404).json({ message: `Aucun ${result.filename} à exporter.` });
    }
    res.header('Content-Type', 'text/csv');
    res.attachment(result.filename);
    res.send(result.csv);
  } catch (error) {
    res.status(500).json({ message: `Erreur export CSV stocklogs_export.csv`, error: error.message });
  }
};

// Export des produits en stock faible
const exportLowStockToCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await exportService.exportLowStockToCSV(userId);
    if (result.error === 'no_data') {
      return res.status(404).json({ message: `Aucun ${result.filename} à exporter.` });
    }
    res.header('Content-Type', 'text/csv');
    res.attachment(result.filename);
    res.send(result.csv);
  } catch (error) {
    res.status(500).json({ message: `Erreur export CSV low_stock_products.csv`, error: error.message });
  }
};

// Export des statistiques d'inventaire
const exportInventoryStatsToCSV = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await exportService.exportInventoryStatsToCSV(userId);
    res.header('Content-Type', 'text/csv');
    res.attachment(result.filename);
    res.send(result.csv);
  } catch (error) {
    res.status(500).json({ message: 'Erreur export statistiques', error: error.message });
  }
}; 

module.exports = {
  exportProductsToCSV,
  exportLogsToCSV,
  exportLowStockToCSV,
  exportInventoryStatsToCSV,
};