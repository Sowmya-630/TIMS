const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user data to request object
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
