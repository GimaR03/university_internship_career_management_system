const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    industry: { type: String, default: 'General', trim: true },
    contactNumber: { type: String, default: '', trim: true },
    address: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
