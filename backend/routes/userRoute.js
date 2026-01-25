import express from 'express';
import {  registerUser } from '../controllers/userController.js';    


const userRouter = express.Router();

userRouter.post('/register', registerUser); // Route for user registration


export default userRouter;