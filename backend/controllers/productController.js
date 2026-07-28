import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import fs from 'fs';

// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, subCategory, sizes, bestseller } = req.body;

        if (!name || !description || price === undefined) {
            return res.json({ success: false, message: "Name, description, and price are required" });
        }

        const image1 = req.files && req.files.image1 && req.files.image1[0];
        const image2 = req.files && req.files.image2 && req.files.image2[0];
        const image3 = req.files && req.files.image3 && req.files.image3[0];
        const image4 = req.files && req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = [];
        
        if (images.length > 0) {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    try {
                        const cloudName = process.env.CLOUDINARY_NAME;
                        if (cloudName && cloudName !== 'your_cloudinary_name' && item.path) {
                            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                            return result.secure_url;
                        }
                    } catch (uploadErr) {
                        console.warn('Cloudinary upload warning:', uploadErr.message);
                    }
                    
                    // Fallback to Base64 Data URI of uploaded file so exact photo uploaded by admin is preserved
                    if (item.path && fs.existsSync(item.path)) {
                        const fileBuffer = fs.readFileSync(item.path);
                        const mimeType = item.mimetype || 'image/jpeg';
                        const base64Data = fileBuffer.toString('base64');
                        try { fs.unlinkSync(item.path); } catch (e) {}
                        return `data:${mimeType};base64,${base64Data}`;
                    }

                    return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop';
                })
            );
        } else {
            // Default placeholder image if no file was uploaded
            imagesUrl = ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop'];
        }

        let parsedSizes = [];
        if (sizes) {
            if (Array.isArray(sizes)) {
                parsedSizes = sizes;
            } else if (typeof sizes === 'string') {
                try {
                    parsedSizes = JSON.parse(sizes);
                } catch {
                    parsedSizes = [sizes];
                }
            }
        }

        const productData = {
            name,
            description,
            category: category || "Men",
            price: Number(price),
            stock: Number(stock) !== undefined && !isNaN(Number(stock)) && Number(stock) >= 0 ? Number(stock) : 100,
            subCategory: subCategory || "Topwear",
            bestseller: bestseller === "true" || bestseller === true ? true : false,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully", product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message || "Failed to add product" });
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ date: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for updating product (Admin)
const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, stock, category, subCategory, sizes, bestseller } = req.body;

        if (!productId) {
            return res.json({ success: false, message: "Product ID is required" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Handle sizes - can be array (JSON body) or string (FormData)
        let parsedSizes = product.sizes;
        if (sizes !== undefined) {
            if (Array.isArray(sizes)) {
                parsedSizes = sizes;
            } else if (typeof sizes === 'string') {
                try { parsedSizes = JSON.parse(sizes); } catch { parsedSizes = [sizes]; }
            }
        }

        const updatedData = {
            name: name || product.name,
            description: description || product.description,
            price: price !== undefined ? Number(price) : product.price,
            stock: stock !== undefined ? Number(stock) : product.stock,
            category: category || product.category,
            subCategory: subCategory || product.subCategory,
            bestseller: bestseller !== undefined ? (bestseller === "true" || bestseller === true) : product.bestseller,
            sizes: parsedSizes
        };

        await productModel.findByIdAndUpdate(productId, updatedData);
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for removing product 
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    } 
}

// Add product review with backend verification
const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.userId || req.body.userId;

        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }

        if (!productId || !rating || !comment) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.json({ success: false, message: "Rating must be between 1 and 5" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // BACKEND ENFORCEMENT: Verify user has purchased this product and order status is 'Delivered'
        const deliveredOrders = await orderModel.find({
            userId: userId,
            status: 'Delivered',
            'items.productId': productId
        });

        if (!deliveredOrders || deliveredOrders.length === 0) {
            return res.json({ 
                success: false, 
                message: "Review submission denied. You can only review products after purchasing and receiving them (Order Status: Delivered)." 
            });
        }

        // Prevent duplicate reviews (update existing review if user submits again)
        const existingReviewIndex = product.reviews.findIndex(
            (r) => r.userId && r.userId.toString() === userId.toString()
        );

        if (existingReviewIndex > -1) {
            product.reviews[existingReviewIndex].rating = Number(rating);
            product.reviews[existingReviewIndex].comment = comment;
            product.reviews[existingReviewIndex].date = new Date();
        } else {
            product.reviews.push({
                userId: userId,
                userName: user.name,
                rating: Number(rating),
                comment,
                date: new Date()
            });
        }

        // Recalculate average rating
        const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        product.rating = product.reviews.length > 0 ? (totalRating / product.reviews.length) : 0;

        await product.save();
        res.json({ success: true, message: existingReviewIndex > -1 ? "Review updated successfully" : "Review added successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get product reviews
const getReviews = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, reviews: product.reviews || [], avgRating: product.rating || 0 });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, updateProduct, removeProduct, singleProduct, addReview, getReviews };