const { body, param, query, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Validation pour l'inscription
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('businessName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de l\'entreprise doit contenir entre 2 et 100 caractères'),
  handleValidationErrors
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  handleValidationErrors
];

// Validation pour les produits
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom du produit doit contenir entre 2 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('La quantité doit être un nombre positif'),
  body('reorderThreshold')
    .isInt({ min: 0 })
    .withMessage('Le seuil de réapprovisionnement doit être un nombre positif'),
  body('unit')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('L\'unité doit contenir entre 1 et 20 caractères'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La catégorie ne peut pas dépasser 50 caractères'),
  body('supplier')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le fournisseur ne peut pas dépasser 100 caractères'),
  handleValidationErrors
];

// Validation pour les opérations de stock
const stockValidation = [
  body('productId')
    .isMongoId()
    .withMessage('ID de produit invalide'),
  body('quantity')
    .isFloat({ min: 0.01 })
    .withMessage('La quantité doit être un nombre positif'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La note ne peut pas dépasser 200 caractères'),
  handleValidationErrors
];

// Validation pour les paramètres d'ID
const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  handleValidationErrors
];

// Validation pour la recherche
const searchValidation = [
  query('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le nom de recherche doit contenir au moins 2 caractères'),
  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La catégorie ne peut pas dépasser 50 caractères'),
  query('supplier')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le fournisseur doit contenir entre 2 et 100 caractères'),
  query('lowStock')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('lowStock doit être true ou false'),
  query('minQty')
    .optional()
    .isInt({ min: 0 })
    .withMessage('minQty doit être un nombre positif'),
  query('maxQty')
    .optional()
    .isInt({ min: 0 })
    .withMessage('maxQty doit être un nombre positif'),
  handleValidationErrors
];

// Validation pour la mise à jour du profil
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('businessName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de l\'entreprise doit contenir entre 2 et 100 caractères'),
  handleValidationErrors
];

// Validation pour le changement de mot de passe
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  productValidation,
  stockValidation,
  idValidation,
  searchValidation,
  updateProfileValidation,
  changePasswordValidation,
  handleValidationErrors
}; 