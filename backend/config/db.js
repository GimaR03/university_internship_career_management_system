const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected Successfully');
        return true;
    } catch (error) {
        console.error('MongoDB Connection Failed:', error);
        return false;
    }
};

module.exports = connectDB;
