const pool = require('../config/database');

const getAllUsers = async (req, res) => {
  try {
    // Seleciona todos os usuários, mas omite a senha por segurança
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao buscar usuários.' });
  }
};

module.exports = {
  getAllUsers,
};
