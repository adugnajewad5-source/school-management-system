const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Parent Authentication Middleware
 * 
 * Validates JWT token and ensures the user has the "parent" role.
 * This middleware protects parent-specific routes.
 * 
 * Requirements: 1.4, 8.3, 9.5, 17.3
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const parentAuthMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'No authorization header provided' 
    });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token provided' 
    });
  }

  try {
    // Verify token signature using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token has expired (jwt.verify already checks this, but we handle the error)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    
    // Verify role is "parent"
    if (decoded.role !== 'parent') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied: Parent role required' 
      });
    }
    
    // Attach decoded user info to req.user for downstream middleware/controllers
    req.user = decoded;
    
    // Proceed to next middleware
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    
    // Handle any other errors
    return res.status(401).json({ 
      success: false,
      message: 'Token verification failed' 
    });
  }
};

module.exports = parentAuthMiddleware;
