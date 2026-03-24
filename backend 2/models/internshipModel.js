const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    category: { type: String, default: 'General', trim: true },
    location: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Internship', internshipSchema);
