// services/product.service.js
// Service métier pour la gestion des produits (création, modification, suppression, etc.)

const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');

const createProduct = async (data, userId) => {
  const product = await Product.create({ ...data, addedBy: userId });
  await AuditLog.create({
    userId,
    action: 'create_product',
    details: { productId: product._id, name: product.name }
  });
  return product;
};

const getMyProducts = async (userId) => {
  return await Product.find({
    addedBy: userId,
    isDeleted: false,
  });
};

const getProductById = async (id, userId) => {
  return await Product.findOne({ _id: id, addedBy: userId, isDeleted: false });
};

const updateProduct = async (id, user, updateData) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) return null;
  if (String(product.addedBy) !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Non autorisé');
  }
  Object.assign(product, updateData);
  await product.save();
  await AuditLog.create({
    userId: user._id,
    action: 'update_product',
    details: { productId: product._id, updateData }
  });
  return product;
};

const deleteProduct = async (id, user) => {
  const product = await Product.findById(id);
  if (!product || product.isDeleted) return null;
  if (String(product.addedBy) !== user._id.toString() && user.role !== 'admin') {
    throw new Error('Non autorisé');
  }
  product.isDeleted = true;
  await product.save();
  await AuditLog.create({
    userId: user._id,
    action: 'delete_product',
    details: { productId: product._id, name: product.name }
  });
  return product;
};

const getLowStockProducts = async (userId) => {
  return await Product.find({
    addedBy: userId,
    $expr: { $lte: ["$quantity", "$reorderThreshold"] }
  });
};

const getInventoryStats = async (userId) => {
  const totalProducts = await Product.countDocuments({ addedBy: userId });
  const products = await Product.find({ addedBy: userId });
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = await Product.countDocuments({
    addedBy: userId,
    $expr: { $lte: ["$quantity", "$reorderThreshold"] },
  });
  const categoryStats = await Product.aggregate([
    { $match: { addedBy: userId } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  return {
    totalProducts,
    totalQuantity,
    lowStockCount,
    categoryStats
  };
};

const searchProducts = async (userId, query) => {
  const { name, category, unit, supplier, lowStock, minQty, maxQty } = query;
  let filter = { addedBy: userId };
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (category) filter.category = category;
  if (unit) filter.unit = unit;
  if (supplier) filter.supplier = { $regex: supplier, $options: 'i' };
  if (lowStock === 'true') filter.$expr = { $lte: ["$quantity", "$reorderThreshold"] };
  if (minQty || maxQty) {
    filter.quantity = {};
    if (minQty) filter.quantity.$gte = parseInt(minQty);
    if (maxQty) filter.quantity.$lte = parseInt(maxQty);
  }
  return await Product.find(filter);
};

const isLowStock = (product) => {
  return product.quantity <= product.reorderThreshold;
};

const addStock = async (product, amount) => {
  product.quantity += amount;
  return await product.save();
};

const removeStock = async (product, amount) => {
  if (product.quantity < amount) {
    throw new Error('Stock insuffisant');
  }
  product.quantity -= amount;
  return await product.save();
};

// Suppression définitive (hard delete) - ADMIN ONLY
const hardDeleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
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
  isLowStock,
  addStock,
  removeStock,
  hardDeleteProduct,
};