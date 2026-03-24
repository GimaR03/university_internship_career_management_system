const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    payerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, default: 'Bank Transfer', trim: true },
    referenceNumber: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
