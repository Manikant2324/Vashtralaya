import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoutes.js';
import aiRouter from './routes/aiRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Set Mongoose query timeout globally
mongoose.set('maxTimeMS', 30000);

// Database & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Request timeout middleware
app.use((req, res, next) => {
    req.setTimeout(60000);
    res.setTimeout(60000);
    next();
});

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (e) {
        console.error('Database middleware error:', e.message);
    }
    next();
});

// API endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter);
app.use('/api/ai', aiRouter);

// API Health Check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Vashtralaya Integrated API is working properly' });
});

// Serve Frontend Static Build files in production / single application deployment
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.use((req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Vashtralaya Unified Backend API is running on port ' + port);
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start server (when not running in serverless environment like Vercel)
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Unified Vashtralaya Server is running on port : ${port}`);
    });
}

export default app;