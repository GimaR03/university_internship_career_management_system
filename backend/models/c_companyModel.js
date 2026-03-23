const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    website: { type: String, default: "", trim: true },
    industry: { type: String, required: true, trim: true },
    companySize: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);