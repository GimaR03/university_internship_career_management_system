const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route     
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ✅: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed ❌");
    console.error(error.message);
    process.exit(1); // Stop server if DB fails
  }
};

// Connect to Database
connectDB();

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
