const express = require("express");
const router = express.Router();
const {
  createIntern,
  getInterns,
} = require("../controllers/internController");

router.post("/", createIntern);
router.get("/", getInterns);

module.exports = router;
