// controllers/stock.controller.js
// Contrôleur HTTP pour la gestion du stock (reçoit les requêtes, délègue au service)

const stockService = require('../services/stock.service');

// 🔼 Entrée de stock
const stockIn = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;
    const product = await stockService.stockIn(productId, quantity, note, req.user._id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    const lowStockAlert = product.quantity <= product.reorderThreshold;
    res.json({
      success: true,
      message: 'Stock ajouté',
      product,
      notification: lowStockAlert
        ? {
            type: "warning",
            title: "Stock faible",
            message: `Attention : le produit "${product.name}" est en stock faible (${product.quantity} restant${product.quantity > 1 ? 's' : ''}) !`
          }
        : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔽 Sortie de stock
const stockOut = async (req, res) => {
  try {
    const { productId, quantity, note } = req.body;
    const result = await stockService.stockOut(productId, quantity, note, req.user._id);
    if (result && result.error === 'not_found') {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }
    if (result && result.error === 'insufficient_stock') {
      return res.status(400).json({ success: false, message: 'Stock insuffisant' });
    }
    const lowStockAlert = result.quantity <= result.reorderThreshold;
    res.json({
      success: true,
      message: 'Stock retiré',
      product: result,
      notification: lowStockAlert
        ? {
            type: "warning",
            title: "Stock faible",
            message: `Attention : le produit "${result.name}" est en stock faible (${result.quantity} restant${result.quantity > 1 ? 's' : ''}) !`
          }
        : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📜 Tous les logs de stock de l'utilisateur
const getAllStockLogs = async (req, res) => {
  try {
    const logs = await stockService.getAllStockLogs(req.user._id);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📜 Logs pour un produit
const getStockLogs = async (req, res) => {
  try {
    const logs = await stockService.getStockLogs(req.params.productId);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📦 Ajuster le stock
const adjustStock = async (req, res) => {
  try {
    const { productId, newQuantity, note } = req.body;
    const result = await stockService.adjustStock(productId, newQuantity, note, req.user._id);
    if (result && result.error === 'invalid_id') {
      return res.status(400).json({ success: false, message: 'ID de produit invalide' });
    }
    if (result && result.error === 'not_found') {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }
    const lowStockAlert = result.quantity <= result.reorderThreshold;
    res.json({
      success: true,
      message: 'Stock ajusté avec succès',
      product: result,
      notification: lowStockAlert
        ? {
            type: "warning",
            title: "Stock faible",
            message: `Attention : le produit "${result.name}" est en stock faible (${result.quantity} restant${result.quantity > 1 ? 's' : ''}) !`
          }
        : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  stockIn,
  stockOut,
  getAllStockLogs,
  getStockLogs,
  adjustStock,
};