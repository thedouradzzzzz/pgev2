const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Todos os campos (nome, email, senha, função) são obrigatórios.' });
  }
  const roleMap = { 'Administrador': 'admin', 'Usuário': 'user' };
  const roleParaBanco = roleMap[role] || 'user';
  try {
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Este email já está cadastrado.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, force_password_change) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, roleParaBanco, true]
    );
    const newUser = { id: result.insertId, name: name, email: email, role: roleParaBanco };
    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!', data: newUser });
  } catch (error) {
    console.error('ERRO NO SERVIDOR AO REGISTRAR USUÁRIO:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor ao tentar registrar o usuário.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios.' });
    }
    const [users] = await pool.query('SELECT id, name, email, password, role, force_password_change FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas (usuário não encontrado).' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas (senha incorreta).' });
    }

    if (user.force_password_change) {
      return res.status(200).json({
        success: true,
        requiresPasswordChange: true,
        userId: user.id,
        message: 'Troca de senha obrigatória.'
      });
    }

    const payload = { id: user.id, name: user.name, role: user.role };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.json({
      success: true,
      requiresPasswordChange: false,
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('ERRO NO SERVIDOR AO FAZER LOGIN:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao fazer login', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
