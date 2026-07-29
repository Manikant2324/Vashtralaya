import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    const rawMongoUrl = process.env.MONGODB_URL?.trim();
    let mongoUri = rawMongoUrl || 'mongodb://127.0.0.1:27017/ecommerce';

    if (rawMongoUrl && !rawMongoUrl.includes('/ecommerce') && !rawMongoUrl.includes('?')) {
        mongoUri = `${rawMongoUrl.replace(/\/+$/, '')}/ecommerce`;
    }

    try {
        const db = await mongoose.connect(mongoUri, {
            dbName: 'ecommerce',
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
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