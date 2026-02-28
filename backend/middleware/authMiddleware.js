const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify that the token hasn't been invalidated by a password change
    const [users] = await pool.execute(
      'SELECT password_changed_at FROM users WHERE id = ?',
      [decoded.id]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    const user = users[0];
    const userPasswordChangedAt = user.password_changed_at ? new Date(user.password_changed_at).getTime() : null;
    const tokenPasswordChangedAt = decoded.password_changed_at;
    
    // If password was changed after token was issued, invalidate the token
    if (userPasswordChangedAt && tokenPasswordChangedAt && userPasswordChangedAt > tokenPasswordChangedAt) {
      return res.status(401).json({ 
        message: 'Your session has been invalidated due to a password change. Please log in again.',
        requiresRelogin: true
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
