const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
require('dotenv').config();

const authenticate = async (req, res, next) => {
  try {

    const tokenFromCookie = req.cookies?.eccomerce;
    let token = tokenFromCookie;

    if (!token) {
      const authHeader = req.header('Authorization') || '';

      token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const rootUser = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!rootUser) {
      return res.status(401).json({ error: 'User not found for this token' });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    console.error('authenticate error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticate;
