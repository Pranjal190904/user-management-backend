const jwt = require('jsonwebtoken');

//middleware to authenticate user
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization") || req.cookies.accessToken;  // Get token from header or cookie
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: "Access Denied" 
        });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verify token
        req.user = verified;  // Set user in request object
        next();
    } catch (error) {
        return res.status(400).json({ 
            success: false,
            message: "Invalid Token" 
        });
    }
};

module.exports = authMiddleware;
