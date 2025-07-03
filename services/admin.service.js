// services/admin.service.js
// Service métier pour la gestion des opérations administrateur

const User = require('../models/User');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

const getAllUsers = async () => {
  return await User.find().select('-password');
};

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const getGlobalStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalStock = await Product.aggregate([
    { $group: { _id: null, total: { $sum: "$quantity" } } },
  ]);
  const totalLogs = await StockLog.countDocuments();
  return {
    totalUsers,
    totalProducts,
    totalStock: totalStock[0]?.total || 0,
    totalLogs
  };
};

const updateUserById = async (id, updateData) => {
  const { name, businessName, role } = updateData;
  const user = await User.findById(id);
  if (!user) return null;
  if (role && !['user', 'admin'].includes(role)) {
    return { error: 'invalid_role' };
  }
  if (name) user.name = name;
  if (businessName) user.businessName = businessName;
  if (role) user.role = role;
  await user.save();
  return user;
};

const softDeleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) return null;
  user.isDeleted = true;
  await user.save();
  return user;
};

const deleteUserById = async (id) => {
  return await User.findByIdAndDelete(id);
}; 

module.exports = {
  getAllUsers,
  getUserById,
  getGlobalStats,
  updateUserById,
  softDeleteUser,
  deleteUserById,
};