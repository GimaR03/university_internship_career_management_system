const express = require("express");
const {
  registerCompany,
  loginCompany,
  getCompanyById,
  updateCompanyById,
  searchStudentsDirectly
} = require("../controllers/c_companyController");

const router = express.Router();

router.post("/register", registerCompany);
router.post("/login", loginCompany);
router.get("/:companyId/search-students", searchStudentsDirectly);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompanyById);

module.exports = router;