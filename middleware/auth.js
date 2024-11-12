// middleware/auth.js

const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user information
const authenticate = (req, res, next) => {
    // Get the token from the headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token and decode the user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the decoded user information to the request object
        next();
    } catch (error) {
        // If token verification fails, return an error
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticate;
