import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    const defaultAtlasUri = 'mongodb+srv://manikant:QWE1245%40%23%24qs@cluster0.bpfv5tq.mongodb.net/ecommerce';
    const rawMongoUrl = process.env.MONGODB_URL?.trim();
    let mongoUri = (rawMongoUrl && rawMongoUrl !== '') ? rawMongoUrl : defaultAtlasUri;

    if (mongoUri && !mongoUri.includes('/ecommerce') && !mongoUri.includes('?')) {
        mongoUri = `${mongoUri.replace(/\/+$/, '')}/ecommerce`;
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