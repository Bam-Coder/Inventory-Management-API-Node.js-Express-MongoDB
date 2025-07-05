// services/stock.service.js
// Service métier pour la gestion du stock et des logs de stock

const Product = require('../models/Product');
const StockLog = require('../models/StockLog');
const mongoose = require('mongoose');

const getTypeLabel = (log) => {
  const types = {
    'in': 'Entrée',
    'out': 'Sortie',
    'adjustment': 'Ajustement'
  };
  return types[log.type] || log.type;
};

const isIncoming = (log) => {
  return log.type === 'in' || log.change > 0;
};
const isOutgoing = (log) => {
  return log.type === 'out' || log.change < 0;
};

const stockIn = async (productId, quantity, note, userId) => {
  const product = await Product.findById(productId);
  if (!product) return null;
  product.quantity += quantity;
  await product.save();
  await StockLog.create({
    productId,
    userId,
    change: quantity,
    type: 'in',
    note: note || 'Entrée de stock',
  });
  return product;
};

const stockOut = async (productId, quantity, note, userId) => {
  const product = await Product.findById(productId);
  if (!product) return { error: 'not_found' };
  if (product.quantity < quantity) return { error: 'insufficient_stock' };
  product.quantity -= quantity;
  await product.save();
  await StockLog.create({
    productId,
    userId,
    change: -quantity,
    type: 'out',
    note: note || 'Sortie de stock',
  });
  return product;
};

const getAllStockLogs = async (userId) => {
  return await StockLog.find({ userId }).sort({ timestamp: -1 });
};

const getStockLogs = async (productId) => {
  return await StockLog.find({ productId })
    .sort({ timestamp: -1 })
    .populate('userId', 'name email');
};

const adjustStock = async (productId, newQuantity, note, userId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { error: 'invalid_id' };
  }
  const product = await Product.findById(productId);
  if (!product) return { error: 'not_found' };
  const difference = newQuantity - product.quantity;
  product.quantity = newQuantity;
  await product.save();
  await StockLog.create({
    productId,
    userId,
    change: difference,
    type: 'adjustment',
    note: note || 'Ajustement manuel',
  });
  return product;
};

module.exports = {
  getTypeLabel,
  isIncoming,
  isOutgoing,
  stockIn,
  stockOut,
  getAllStockLogs,
  getStockLogs,
  adjustStock,
};