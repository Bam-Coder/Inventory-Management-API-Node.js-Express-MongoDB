// services/export.service.js
// Service métier pour l'exportation des données (produits, logs, statistiques) en CSV

const { Parser } = require('json2csv');
const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

const exportToCSV = async (query, fields, filename) => {
  const data = await query.lean();
  if (!data.length) {
    return { error: 'no_data', filename };
  }
  const opts = { fields };
  const parser = new Parser(opts);
  const csv = parser.parse(data);
  return { csv, filename };
};

const exportProductsToCSV = (userId) => {
  const query = Product.find({ addedBy: userId, isDeleted: false });
  const fields = ['name', 'description', 'quantity', 'reorderThreshold', 'unit', 'category', 'supplier'];
  const filename = 'products_export.csv';
  return exportToCSV(query, fields, filename);
};

const exportLogsToCSV = (userId) => {
  const query = StockLog.find({ userId }).populate('productId', 'name');
  const fields = ['productId.name', 'change', 'type', 'note', 'timestamp'];
  const filename = 'stocklogs_export.csv';
  return exportToCSV(query, fields, filename);
};

const exportLowStockToCSV = (userId) => {
  const query = Product.find({
    addedBy: userId,
    isDeleted: false,
    $expr: { $lte: ["$quantity", "$reorderThreshold"] }
  });
  const fields = ['name', 'description', 'quantity', 'reorderThreshold', 'unit', 'category', 'supplier'];
  const filename = 'low_stock_products.csv';
  return exportToCSV(query, fields, filename);
};

const exportInventoryStatsToCSV = async (userId) => {
  const totalProducts = await Product.countDocuments({ addedBy: userId, isDeleted: false });
  const products = await Product.find({ addedBy: userId, isDeleted: false });
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = await Product.countDocuments({
    addedBy: userId,
    isDeleted: false,
    $expr: { $lte: ["$quantity", "$reorderThreshold"] },
  });
  const categoryStats = await Product.aggregate([
    { $match: { addedBy: userId, isDeleted: false } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalQuantity: { $sum: "$quantity" }
      }
    }
  ]);
  const statsData = [
    { metric: 'Total Products', value: totalProducts },
    { metric: 'Total Quantity', value: totalQuantity },
    { metric: 'Low Stock Products', value: lowStockCount }
  ];
  categoryStats.forEach(cat => {
    statsData.push({
      metric: `Category: ${cat._id || 'Uncategorized'}`,
      value: `${cat.count} products, ${cat.totalQuantity} units`
    });
  });
  const fields = ['metric', 'value'];
  const filename = 'inventory_stats.csv';
  const parser = new Parser({ fields });
  const csv = parser.parse(statsData);
  return { csv, filename };
}; 
module.exports = {
  exportToCSV,
  exportProductsToCSV,
  exportLogsToCSV,
  exportLowStockToCSV,
  exportInventoryStatsToCSV,
};