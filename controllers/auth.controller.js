const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

//controller for user registration
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); // Check if user already exists
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists" 
            });
        }
        const salt= process.env.SALT || 10;
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password
        const newUser = new User({ email, password: hashedPassword});
        await newUser.save();
        return res.status(201).json({ 
            success: true,
            message: "User Registered Successfully" 
        });
    } catch (error) {
       return res.status(500).json({ 
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};


//controller for user login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });  // Check if user exists
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found" 
            });
        }

        const validPassword = bcrypt.compare(password, user.password); // Compare passwords
        if (!validPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Invalid Credentials" 
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie('accessToken', token, { httpOnly: true });
        return res.status(200).json({ 
            success: true,
            message: "Login Successful",
            data: { token } 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};

module.exports = { register, login };