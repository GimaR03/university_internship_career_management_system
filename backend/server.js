const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use("/api/students", require('./routes/s_registerRoutes'));
app.use("/api/company", require("./routes/c_companyRoutes"));
app.use("/api/internships", require("./routes/c_internshipRoutes"));
app.use("/api/upload", require("./routes/c_uploadRoutes"));
app.use("/api/payments", require("./routes/p_paymentRoutes"));
app.use("/api/pro-accounts", require("./routes/p_proAccountRoutes"));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'MERN Stack API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    const isDatabaseConnected = await connectDB();

    if (!isDatabaseConnected) {
        console.warn('Starting server without MongoDB. Task data will be stored in memory until the process restarts.');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
