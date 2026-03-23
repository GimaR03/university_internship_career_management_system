const mongoose = require("mongoose");

const JOB_CATEGORIES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "QA Engineer",
  "Software Tester",
  "Automation Tester",
  "DevOps Engineer",
  "Cloud Engineer",
  "System Administrator",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "UI/UX Designer",
  "Project Manager",
  "Product Manager",
  "Business Analyst",
  "Cybersecurity Analyst"
];

const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara",
  "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota",
  "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu",
  "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam",
  "Anuradhapura", "Polonnaruwa",
  "Badulla", "Moneragala",
  "Ratnapura", "Kegalle"
];

const internshipSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    title: { type: String, required: true, trim: true, enum: JOB_CATEGORIES },
    description: { type: String, required: true, trim: true },
    requirements: [{ type: String, required: true, trim: true }],
    skills: [{ type: String, required: true, trim: true }],
    location: { type: String, required: true, trim: true, enum: DISTRICTS },
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Remote", "Hybrid"],
      default: "Full-time"
    },
    duration: { type: String, required: true, trim: true },
    stipend: { type: Number, required: true, min: 0 },
    openings: { type: Number, required: true, min: 1 },
    deadline: { type: Date, required: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active"
    },
    paymentVerificationStatus: {
      type: String,
      enum: ["not_verified", "pending", "verified", "rejected"],
      default: "not_verified"
    },
    paymentVerifiedAt: { type: Date, default: null },
    applications: { type: Array, default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);