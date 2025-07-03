// routes/auth.routes.js
// Définition des routes pour l'authentification et la gestion des utilisateurs (mapping URL vers contrôleur, gestion des middlewares)

const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMyProfile, 
  updateMyProfile, 
  changePassword 
} = require('../controllers/auth.controller');
const { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation, 
  changePasswordValidation 
} = require('../utils/validation');
const { authLimiter } = require('../middlewares/security');
const { protect } = require('../middlewares/auth.middleware');

// Routes d'authentification
router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);

// Routes de gestion de profil (protégées)
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateProfileValidation, updateMyProfile);
router.put('/password', protect, changePasswordValidation, changePassword);

module.exports = router;
