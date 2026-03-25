const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const getJwtSecret = () => process.env.JWT_SECRET || 'adminSecretKey';

const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, getJwtSecret());

      req.admin = await Admin.findById(decoded.id);
      if (!req.admin) {
        return res.status(401).json({ success: false, message: 'Admin not found' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token failed' });
    }
  }

  return res.status(401).json({ success: false, message: 'No token' });
};

const attachAdminIfPresent = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, getJwtSecret());
      req.admin = await Admin.findById(decoded.id);
    } catch (error) {
      req.admin = null;
    }
  }

  next();
};

const allowAdminRoles = (...roles) => (req, res, next) => {
  if (!req.admin) {
    return res.status(401).json({ success: false, message: 'Admin not authenticated' });
  }

  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  next();
};

module.exports = {
  protectAdmin,
  attachAdminIfPresent,
  allowAdminRoles,
};
