const mongoose = require("mongoose");
const Internship = require("../models/c_internshipModel");
const Payment = require("../models/p_paymentModel");

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

const normalizeArrayField = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const isFutureDate = (dateValue) => {
  const selectedDate = new Date(dateValue);
  const today = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return selectedDate > today;
};

exports.createInternship = async (req, res) => {
  try {
    const {
      companyId,
      title,
      description,
      requirements,
      skills,
      location,
      type,
      duration,
      stipend,
      openings,
      deadline,
      images
    } = req.body;

    if (!companyId || !title || !description || !location || !duration || !deadline) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (!JOB_CATEGORIES.includes(title)) {
      return res.status(400).json({ success: false, message: "Please select a valid job category" });
    }

    if (!DISTRICTS.includes(location)) {
      return res.status(400).json({ success: false, message: "Please select a valid district" });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: "Invalid companyId" });
    }

    const requirementsArray = normalizeArrayField(requirements);
    const skillsArray = normalizeArrayField(skills);

    if (requirementsArray.length === 0 || skillsArray.length === 0) {
      return res.status(400).json({ success: false, message: "Requirements and skills are required" });
    }

    const stipendNumber = Number(stipend);
    const openingsNumber = Number(openings);

    if (!Number.isFinite(stipendNumber) || stipendNumber < 0) {
      return res.status(400).json({ success: false, message: "Stipend must be a valid non-negative number" });
    }

    if (!Number.isInteger(openingsNumber) || openingsNumber < 1) {
      return res.status(400).json({ success: false, message: "Openings must be at least 1" });
    }

    if (!isFutureDate(deadline)) {
      return res.status(400).json({ success: false, message: "Application deadline must be a future date" });
    }

    const internship = await Internship.create({
      companyId,
      title,
      description,
      requirements: requirementsArray,
      skills: skillsArray,
      location,
      type,
      duration,
      stipend: stipendNumber,
      openings: openingsNumber,
      deadline,
      images: Array.isArray(images) ? images : []
    });

    return res.status(201).json({
      success: true,
      message: "Internship posted successfully",
      data: internship
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyInternships = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: "Invalid companyId" });
    }

    const internships = await Internship.find({ companyId }).sort({ createdAt: -1 });

    const internshipIds = internships.map((item) => item._id);
    const payments = await Payment.find({ internshipId: { $in: internshipIds } }).sort({ createdAt: -1 });

    const latestPaymentByInternship = new Map();
    for (const payment of payments) {
      const key = String(payment.internshipId || "");
      if (key && !latestPaymentByInternship.has(key)) {
        latestPaymentByInternship.set(key, payment);
      }
    }

    const merged = internships.map((item) => {
      const internship = item.toObject();
      const latestPayment = latestPaymentByInternship.get(String(item._id));

      if (!latestPayment) {
        return internship;
      }

      const normalizedStatus = latestPayment.status === "verified"
        ? "verified"
        : latestPayment.status === "rejected"
          ? "rejected"
          : "pending";

      return {
        ...internship,
        paymentVerificationStatus: normalizedStatus,
        paymentVerifiedAt: latestPayment.status === "verified" ? latestPayment.updatedAt : null
      };
    });

    return res.status(200).json({ success: true, data: merged });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicInternships = async (req, res) => {
  try {
    const internships = await Internship.find({
      status: "active",
      paymentVerificationStatus: "verified"
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: internships });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    return res.status(200).json({ success: true, data: internship });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.paymentVerificationStatus;
    delete updates.paymentVerifiedAt;

    if (Object.prototype.hasOwnProperty.call(updates, "requirements")) {
      updates.requirements = normalizeArrayField(updates.requirements);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "skills")) {
      updates.skills = normalizeArrayField(updates.skills);
    }

    if (Object.prototype.hasOwnProperty.call(updates, "stipend")) {
      const stipendNumber = Number(updates.stipend);
      if (!Number.isFinite(stipendNumber) || stipendNumber < 0) {
        return res.status(400).json({ success: false, message: "Stipend must be a valid non-negative number" });
      }
      updates.stipend = stipendNumber;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "openings")) {
      const openingsNumber = Number(updates.openings);
      if (!Number.isInteger(openingsNumber) || openingsNumber < 1) {
        return res.status(400).json({ success: false, message: "Openings must be at least 1" });
      }
      updates.openings = openingsNumber;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "deadline") && !isFutureDate(updates.deadline)) {
      return res.status(400).json({ success: false, message: "Application deadline must be a future date" });
    }

    if (Object.prototype.hasOwnProperty.call(updates, "title") && !JOB_CATEGORIES.includes(updates.title)) {
      return res.status(400).json({ success: false, message: "Please select a valid job category" });
    }

    if (Object.prototype.hasOwnProperty.call(updates, "location") && !DISTRICTS.includes(updates.location)) {
      return res.status(400).json({ success: false, message: "Please select a valid district" });
    }

    const internship = await Internship.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    return res.status(200).json({ success: true, message: "Internship updated successfully", data: internship });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);

    if (!internship) {
      return res.status(404).json({ success: false, message: "Internship not found" });
    }

    return res.status(200).json({ success: true, message: "Internship deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};