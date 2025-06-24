const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-senha');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Usu·rio n„o encontrado.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'N„o autorizado, token inv·lido.' });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'N„o autorizado, sem token.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.cargo)) {
      return res.status(403).json({ success: false, message: "O usu√°rio com este cargo n√£o tem permiss√£o para acessar esta rota." });
    }
    next();
  };
};
