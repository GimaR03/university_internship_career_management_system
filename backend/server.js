const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./routes/taskRoutes'));

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
