const pool = require('../config/database'); // Importa nossa conexão MySQL

// Listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const [produtos] = await pool.query('SELECT * FROM produtos');
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
  }
};

// Criar um novo produto
const createProduct = async (req, res) => {
  const { name, description, price, quantity } = req.body;

  if (!name || !price || quantity == null) {
    return res.status(400).json({ success: false, message: 'Nome, preço e quantidade são obrigatórios.' });
  }

  try {
    const sql = 'INSERT INTO produtos (name, description, price, quantity) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [name, description, price, quantity]);
    const [[newProduct]] = await pool.query('SELECT * FROM produtos WHERE id = ?', [result.insertId]);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro no servidor ao criar produto', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
};
