import mongoose from 'mongoose';

const connectDB = async () => {
    const rawMongoUrl = process.env.MONGODB_URL?.trim();
    const mongoBaseUrl = rawMongoUrl ? rawMongoUrl.replace(/\/+$/, '') : 'mongodb://127.0.0.1:27017';
    const mongoUri = mongoBaseUrl.endsWith('/ecommerce') ? mongoBaseUrl : `${mongoBaseUrl}/ecommerce`;

    mongoose.connection.on('connected', () => {
        console.log('MongoDB Connected');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message);
    });

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            retryReads: true,
        });
    } catch (error) {
        console.warn('MongoDB connection skipped. Configure MONGODB_URL or start MongoDB to enable database features.');
        console.warn(error.message);
    }
};

export default connectDB;