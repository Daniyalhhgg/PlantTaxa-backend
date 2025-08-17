const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
        quantity: { type: Number, default: 1, min: 1 },
        priceAtPurchase: { type: Number, required: true },
      }
    ],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
