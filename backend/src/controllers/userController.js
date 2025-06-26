const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at, force_password_change FROM users');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao buscar usuários.' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, forcePasswordChange } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Nome, email e função são obrigatórios.' });
  }
  
  const roleParaBanco = role === 'admin' ? 'admin' : 'user';

  try {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, role = ?, force_password_change = ? WHERE id = ?',
      [name, email, roleParaBanco, !!forcePasswordChange, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const [[updatedUser]] = await pool.query('SELECT id, name, email, role, force_password_change FROM users WHERE id = ?', [id]);
    res.json({ success: true, data: updatedUser });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao atualizar usuário.' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao deletar usuário.' });
  }
};

const forceChangePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ success: false, message: 'ID do usuário e nova senha são obrigatórios.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const [result] = await pool.query(
      'UPDATE users SET password = ?, force_password_change = ? WHERE id = ?',
      [hashedPassword, false, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao forçar troca de senha:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  forceChangePassword,
};
