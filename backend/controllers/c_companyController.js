const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Company = require("../models/c_companyModel");
const Student = require("../models/s_registerModel");
const { ensureProAccess } = require("./p_proAccountController");

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

const sanitizeCompany = (company) => ({
  id: company._id,
  companyName: company.companyName,
  email: company.email,
  phone: company.phone,
  address: company.address,
  website: company.website,
  industry: company.industry,
  companySize: company.companySize,
  description: company.description,
  createdAt: company.createdAt,
  updatedAt: company.updatedAt
});

const signCompanyToken = (companyId) => {
  const jwtSecret = process.env.JWT_SECRET || "secretKey";
  return jwt.sign({ id: companyId }, jwtSecret, { expiresIn: "1d" });
};

exports.registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      email,
      password,
      phone,
      address,
      website,
      industry,
      companySize,
      description
    } = req.body;

    if (!companyName || !email || !password || !phone || !address || !industry || !companySize || !description) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingCompany = await Company.findOne({ email: email.toLowerCase() });
    if (existingCompany) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      companyName,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      website: website || "",
      industry,
      companySize,
      description
    });

    const token = signCompanyToken(company._id);

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",
      token,
      data: sanitizeCompany(company)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const company = await Company.findOne({ email: email.toLowerCase() });
    if (!company) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = signCompanyToken(company._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: sanitizeCompany(company)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({ success: true, data: sanitizeCompany(company) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompanyById = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updates, "password")) {
      delete updates.password;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "email") && updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      data: sanitizeCompany(company)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchStudentsDirectly = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { category, district } = req.query;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ success: false, message: "Invalid companyId" });
    }

    if (!category || !district) {
      return res.status(400).json({ success: false, message: "Category and district are required" });
    }

    if (!JOB_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid job category" });
    }

    if (!DISTRICTS.includes(district)) {
      return res.status(400).json({ success: false, message: "Invalid district" });
    }

    const proCheck = await ensureProAccess(companyId);
    if (!proCheck.allowed) {
      return res.status(403).json({
        success: false,
        message: "Direct student search is available for Pro accounts only",
        requiresPro: true
      });
    }

    const students = await Student.find({
      $or: [
        { district },
        { preferredJobCategories: { $in: [category] } }
      ]
    }).sort({ createdAt: -1 });

    const results = students.map((student) => {
      const matchesCategory = Array.isArray(student.preferredJobCategories) && student.preferredJobCategories.includes(category);
      const matchesDistrict = student.district === district;

      let matchScore = 0;
      if (matchesCategory) matchScore += 60;
      if (matchesDistrict) matchScore += 40;

      return {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        contactNumber: student.contactNumber,
        district: student.district || "",
        preferredJobCategories: student.preferredJobCategories || [],
        skills: student.skills || [],
        university: student.university || "",
        course: student.course || "",
        year: student.year || "",
        matchScore,
        matchedBy: {
          category: matchesCategory,
          district: matchesDistrict
        }
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      data: results,
      meta: {
        category,
        district,
        total: results.length
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};