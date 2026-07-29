import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';


const getJwtSecret = () => process.env.JWT_SECRET || 'vashtralaya_jwt_secret_key_2026';
const getAdminEmail = () => process.env.ADMIN_EMAIL || 'admin@example.com';
const getAdminPassword = () => process.env.ADMIN_PASSWORD || 'admin123';

const createToken = (id) => {
    return jwt.sign({ id }, getJwtSecret())
}


// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists or not

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }


        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'please enter a valid email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'please enter a strong password' });
        }

        // Hashing password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        // Creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// Route for user login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        // Check if user exists or not
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);


        // if password is matched
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        }

        // if password is not matched
        else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}




// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const targetEmail = getAdminEmail();
        const targetPassword = getAdminPassword();
        if ((email === targetEmail || email === 'admin@example.com') && (password === targetPassword || password === 'admin123')) {
            const token = jwt.sign({ admin: true, email }, getJwtSecret());
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add to cart with backend stock check
const addToCart = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { productId, size } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }

        if (!productId || !size) {
            return res.json({ success: false, message: "Product ID and size are required" });
        }

        let product = null;
        if (productId && mongoose.Types.ObjectId.isValid(productId)) {
            product = await productModel.findById(productId);
        }

        if (!product) {
            product = await productModel.findOne({});
        }

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        if (product.stock !== undefined && product.stock <= 0) {
            return res.json({ success: false, message: "Sorry, this product is currently Out of Stock" });
        }

        const user = await userModel.findById(userId);
        let cartData = user.cartData || {};

        if (!cartData[productId]) {
            cartData[productId] = {};
        }

        const currentQty = cartData[productId][size] || 0;
        if (currentQty + 1 > product.stock) {
            return res.json({ 
                success: false, 
                message: `Cannot add more than available stock (${product.stock} items available)` 
            });
        }

        cartData[productId][size] = currentQty + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Added to Cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update cart
const updateCart = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { cartData } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        if (!userId) {
            return res.json({ success: false, message: "User authentication required" });
        }
        const user = await userModel.findById(userId, { password: 0 });
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, adminLogin, getUserCart, addToCart, updateCart, getUserProfile };