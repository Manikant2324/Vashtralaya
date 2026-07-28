import express from 'express';
import { registerUser, loginUser, adminLogin, getUserCart, addToCart, updateCart, getUserProfile } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser); // Route for user registration
userRouter.post('/login', loginUser); // Route for user login 
userRouter.post('/admin', adminLogin); // Route for admin login
userRouter.post('/cart', userAuth, getUserCart); // Get user cart
userRouter.post('/add-to-cart', userAuth, addToCart); // Add to cart
userRouter.post('/update-cart', userAuth, updateCart); // Update cart
userRouter.post('/profile', userAuth, getUserProfile); // Get user profile

export default userRouter;