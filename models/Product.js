// models/Product.js
// Schéma Mongoose pour la collection Product (structure et validation uniquement)

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  reorderThreshold: {
    type: Number,
    required: true,
    default: 5,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50
  },
  supplier: {
    type: String,
    trim: true,
    maxlength: 100
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances
productSchema.index({ addedBy: 1, isDeleted: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
