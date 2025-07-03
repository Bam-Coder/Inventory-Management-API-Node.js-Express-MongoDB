const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const {
  getAllUsers,
  getUserById,
  getGlobalStats,
  softDeleteUser,
  updateUserById,
  deleteUserById,
  getAuditLogs,
  hardDeleteProduct,
  softDeleteProduct
} = require('../controllers/admin.controller');

// Toutes les routes sont protégées ET réservées à l'admin
router.use(protect);
router.use(restrictTo('admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/stats/global', getGlobalStats);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', softDeleteUser);
router.delete('/delete/users/:id', deleteUserById);
router.get('/audit/logs', getAuditLogs);
router.delete('/delete/product/:id', hardDeleteProduct);
router.delete('/products/:id', softDeleteProduct);

module.exports = router;
