const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader?.split(' ')[1]; // Extract the token part (Bearer <token>)
    console.log(token);
  // If token is missing, return Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token with the secret key (used during login)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; // Add the user information from the token to the request object
      next();
     // Proceed to the next middleware or route handler
  } catch (error) {
    // If token verification fails
    return res.status(403).json({ message: 'Invalid token' });
  }
};


module.exports = authenticateToken;
