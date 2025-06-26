const pool = require('../config/database');

// @desc    Cria um novo registro de log
// @route   POST /api/logs
// @access  Privado
const createLog = async (req, res) => {
  const { userId, username, actionType, description, details } = req.body;

  if (!userId || !username || !actionType || !description) {
    return res.status(400).json({ success: false, message: 'Todos os campos do log são obrigatórios.' });
  }

  try {
    const detailsString = details ? JSON.stringify(details) : null;
    
    // CORREÇÃO: Garantir que o userId seja um número inteiro antes de inserir no banco.
    const userIdInt = parseInt(userId, 10);

    const [result] = await pool.query(
      'INSERT INTO logs (user_id, username, action_type, description, details) VALUES (?, ?, ?, ?, ?)',
      [userIdInt, username, actionType, description, detailsString]
    );

    const [[newLog]] = await pool.query('SELECT * FROM logs WHERE id = ?', [result.insertId]);

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    console.error('Erro ao criar log no banco de dados:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor ao tentar salvar o log.' });
  }
};

// @desc    Busca todos os registros de log
// @route   GET /api/logs
// @access  Privado
const getAllLogs = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        user_id, 
        username, 
        action_type, 
        description, 
        details, 
        DATE_FORMAT(timestamp, '%Y-%m-%dT%H:%i:%s.000Z') as timestamp 
      FROM logs 
      ORDER BY timestamp DESC
    `;
    const [logs] = await pool.query(sql);
    res.status(200).json({ success: true, data: logs });
  } catch (error)
  {
    console.error('Erro ao buscar logs do banco de dados:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor ao buscar os logs.' });
  }
};

module.exports = {
  createLog,
  getAllLogs,
};
