// controllers/auth.controller.js
// Contrôleur HTTP pour l'authentification et la gestion des utilisateurs (reçoit les requêtes, délègue au service)

const authService = require('../services/auth.service');

// Inscription
const registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    if (result.error === 'user_exists') {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet email existe déjà"
      });
    }
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du compte",
      error: error.message
    });
  }
};

// Connexion
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    if (result.error === 'invalid_credentials') {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }
    if (result.error === 'deactivated') {
      return res.status(401).json({
        success: false,
        message: "Compte désactivé"
      });
    }
    res.json({
      success: true,
      message: "Connexion réussie",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message
    });
  }
};

// Voir son propre profil
const getMyProfile = async (req, res) => {
  try {
    const user = await authService.getMyProfile(req.user._id);
    res.json({
      success: true,
      message: "Profil récupéré avec succès",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message
    });
  }
};

// Modifier son propre profil
const updateMyProfile = async (req, res) => {
  try {
    const result = await authService.updateMyProfile(req.user._id, req.body);
    if (result.error === 'not_found') {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    if (result.error === 'email_exists') {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé par un autre utilisateur"
      });
    }
    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du profil",
      error: error.message
    });
  }
};

// Changer son mot de passe
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user._id, currentPassword, newPassword);
    if (result && result.error === 'not_found') {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }
    if (result && result.error === 'invalid_current_password') {
      return res.status(400).json({
        success: false,
        message: "Mot de passe actuel incorrect"
      });
    }
    res.json({
      success: true,
      message: "Mot de passe changé avec succès"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors du changement de mot de passe",
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  changePassword,
};