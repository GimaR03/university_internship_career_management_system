const Intern = require("../models/Intern");

// Create Intern
const createIntern = async (req, res) => {
  try {
    const { name, email, university, field } = req.body;

    const intern = await Intern.create({
      name,
      email,
      university,
      field,
    });

    res.status(201).json(intern);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Interns
const getInterns = async (req, res) => {
  try {
    const interns = await Intern.find();
    res.json(interns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIntern,
  getInterns,
};
