const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

        console.log('Connecting to MongoDB...');
        const connection = await mongoose.connect(mongoUri);
        console.log(`MongoDB connected: ${connection.connection.host}`);

        return true;
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        console.warn('Starting server without MongoDB. Database-backed features will not work until the connection is restored.');

        return false;
    }
};

module.exports = connectDB;
