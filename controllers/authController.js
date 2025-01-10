const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
