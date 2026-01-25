import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
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
        if (!validator.isEmail) {
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






export {  registerUser};