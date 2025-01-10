const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            throw new Error();
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;