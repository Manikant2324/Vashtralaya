import express from 'express';
import {  registerUser,loginUser } from '../controllers/userController.js';    


const userRouter = express.Router();

userRouter.post('/register', registerUser); // Route for user registration
userRouter.post('/login', loginUser); // Route for user login     

export default userRouter;