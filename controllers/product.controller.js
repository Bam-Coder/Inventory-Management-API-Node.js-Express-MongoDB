// controllers/product.controller.js
// Contrôleur HTTP pour la gestion des produits (reçoit les requêtes, délègue au service)

const productService = require('../services/product.service');

// Créer un produit
const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body, req.user._id);
    res.status(201).json({ success: true, message: "Produit créé avec succès", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tous les produits de l'utilisateur connecté
const getMyProducts = async (req, res) => {
  try {
    const products = await productService.getMyProducts(req.user._id);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Détails d'un produit
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id, req.user._id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Modifier un produit
const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.user, req.body);
    if (!product) return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    res.json({ success: true, message: "Produit mis à jour avec succès", data: product });
  } catch (error) {
    if (error.message === 'Non autorisé') {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id, req.user);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable ou déjà supprimé.' });
    res.status(200).json({ success: true, message: 'Produit supprimé avec succès.' });
  } catch (error) {
    if (error.message === 'Non autorisé') {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Produits avec stock faible
const getLowStockProducts = async (req, res) => {
  try {
    const products = await productService.getLowStockProducts(req.user._id);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Statistiques d'inventaire
const getInventoryStats = async (req, res) => {
  try {
    const stats = await productService.getInventoryStats(req.user._id);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rechercher des produits
const searchProducts = async (req, res) => {
  try {
    const products = await productService.searchProducts(req.user._id, req.query);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getInventoryStats,
  searchProducts,
};