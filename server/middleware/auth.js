const jwt = require('jsonwebtoken');
const { User, Student, Counsellor } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.user_id, {
      include: [
        { model: Student, required: false },
        { model: Counsellor, required: false }
      ]
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

const requireStudent = requireRole(['student']);
const requireCounsellor = requireRole(['counsellor']);
const requireAdmin = requireRole(['admin']);
const requireCounsellorOrAdmin = requireRole(['counsellor', 'admin']);

module.exports = {
  authenticateToken,
  requireRole,
  requireStudent,
  requireCounsellor,
  requireAdmin,
  requireCounsellorOrAdmin
};
