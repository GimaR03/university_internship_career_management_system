const express = require("express");
const {
  createInternship,
  getCompanyInternships,
  getPublicInternships,
  getInternshipById,
  updateInternship,
  deleteInternship
} = require("../controllers/c_internshipController");

const router = express.Router();

router.post("/", createInternship);
router.get("/public", getPublicInternships);
router.get("/company/:companyId", getCompanyInternships);
router.get("/:id", getInternshipById);
router.put("/:id", updateInternship);
router.delete("/:id", deleteInternship);

module.exports = router;