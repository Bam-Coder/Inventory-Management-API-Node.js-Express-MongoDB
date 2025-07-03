// controllers/admin.controller.js
// Contrôleur HTTP pour la gestion des opérations administrateur (reçoit les requêtes, délègue au service)

const adminService = require('../services/admin.service');
const AuditLog = require('../models/AuditLog');
const productService = require('../services/product.service');

// Voir tous les utilisateurs (pour admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};

// Voir un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Statistiques globales
const getGlobalStats = async (req, res) => {
  try {
    const stats = await adminService.getGlobalStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors des statistiques', error: error.message });
  }
};

// Modifier un utilisateur
const updateUserById = async (req, res) => {
  try {
    const user = await adminService.updateUserById(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    if (user.error === 'invalid_role') {
      return res.status(400).json({ success: false, message: 'Rôle invalide.' });
    }
    res.json({ success: true, message: 'Utilisateur mis à jour.', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Désactiver un utilisateur
const softDeleteUser = async (req, res) => {
  try {
    const user = await adminService.softDeleteUser(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    res.json({ success: true, message: 'Utilisateur désactivé avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la désactivation', error: error.message });
  }
};

// Supprimer définitivement un utilisateur
const deleteUserById = async (req, res) => {
  try {
    const user = await adminService.deleteUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    res.json({ success: true, message: 'Utilisateur supprimé définitivement.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAuditLogs = async (req, res) => {
  const { userId, action, from, to } = req.query;
  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;
  if (from || to) filter.timestamp = {};
  if (from) filter.timestamp.$gte = new Date(from);
  if (to) filter.timestamp.$lte = new Date(to);
  const logs = await AuditLog.find(filter).populate('userId', 'name email').sort({ timestamp: -1 }).limit(100);
  res.json({ success: true, logs });
};

// Suppression définitive d'un produit (admin only)
const hardDeleteProduct = async (req, res) => {
  try {
    const product = await productService.hardDeleteProduct(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable.' });
    res.json({ success: true, message: 'Produit supprimé définitivement.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete d'un produit (admin)
const softDeleteProduct = async (req, res) => {
  try {
    const product = await productService.deleteProduct(req.params.id, req.user);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable ou déjà supprimé.' });
    res.json({ success: true, message: 'Produit désactivé (soft delete) avec succès.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getGlobalStats,
  updateUserById,
  softDeleteUser,
  deleteUserById,
  getAuditLogs,
  hardDeleteProduct,
  softDeleteProduct,
};