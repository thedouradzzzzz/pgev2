const jwt = require('jsonwebtoken');
const pool = require('../config/database'); 

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [users] = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id = ?', 
        [decoded.id]
      );
      
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Não autorizado, usuário do token não existe mais.' });
      }
      
      req.user = users[0];
      next();
    } catch (error) {
      console.error("Erro no middleware 'protect':", error);
      return res.status(401).json({ success: false, message: 'Não autorizado, token inválido ou expirado.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Não autorizado, nenhum token fornecido.' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Acesso negado. A rota requer um dos seguintes cargos: ${roles.join(', ')}.` 
      });
    }
    next();
  };
};
