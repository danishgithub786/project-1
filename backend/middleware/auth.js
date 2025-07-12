const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is employer
const isEmployer = (req, res, next) => {
  if (req.user.userType !== 'employer') {
    return res.status(403).json({ message: 'Access denied. Employer only.' });
  }
  next();
};

// Middleware to check if user is jobseeker
const isJobseeker = (req, res, next) => {
  if (req.user.userType !== 'jobseeker') {
    return res.status(403).json({ message: 'Access denied. Jobseeker only.' });
  }
  next();
};

module.exports = {
  auth,
  isEmployer,
  isJobseeker
}; 