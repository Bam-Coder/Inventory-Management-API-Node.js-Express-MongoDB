// models/StockLog.js
// Schéma Mongoose pour la collection StockLog (structure et validation uniquement)

const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  change: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v !== 0;
      },
      message: 'Le changement de stock ne peut pas être zéro'
    }
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment'],
    required: true
  },
  note: {
    type: String,
    trim: true,
    maxlength: 200
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour améliorer les performances
stockLogSchema.index({ productId: 1, timestamp: -1 });
stockLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('StockLog', stockLogSchema);
