import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    const rawMongoUrl = process.env.MONGODB_URL?.trim();
    const mongoBaseUrl = rawMongoUrl ? rawMongoUrl.replace(/\/+$/, '') : 'mongodb://127.0.0.1:27017';
    const mongoUri = mongoBaseUrl.endsWith('/ecommerce') ? mongoBaseUrl : `${mongoBaseUrl}/ecommerce`;

    try {
        const db = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            family: 4,
            retryWrites: true,
            retryReads: true,
        });
        isConnected = db.connections[0].readyState >= 1;
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        isConnected = false;
    }
};

export default connectDB;