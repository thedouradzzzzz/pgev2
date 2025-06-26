const pool = require('../config/database');

const getAllProducts = async (req, res) => {
  try {
    const sql = `
      SELECT
        p.*,
        c.name as categoryName,
        f.name as fornecedorName
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN fornecedores f ON p.fornecedor_id = f.id
      ORDER BY p.name ASC
    `;
    const [produtos] = await pool.query(sql);
    res.status(200).json({ success: true, data: produtos });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor', error: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, description, empresa, categoria_id, fornecedor_id, barcode } = req.body;
  const empresasPermitidas = ['ABPlast', 'Catarinense Matriz', 'Catarinense Filial'];
  if (!name || !empresa) {
    return res.status(400).json({ success: false, message: 'Nome e empresa são obrigatórios.' });
  }
  if (!empresasPermitidas.includes(empresa)) {
    return res.status(400).json({ success: false, message: 'Empresa inválida.' });
  }
  try {
    const sql = 'INSERT INTO produtos (name, description, empresa, quantity, categoria_id, fornecedor_id, barcode) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(sql, [name, description, empresa, 0, categoria_id || null, fornecedor_id || null, barcode || null]);

    if (req.user && req.user.id) {
        console.log(`LOG: Produto '${name}' cadastrado na empresa '${empresa}' pelo usuário ID: ${req.user.id}`);
    }

    const [newProduct] = await pool.query(`
      SELECT
        p.*,
        c.name as categoryName,
        f.name as fornecedorName
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN fornecedores f ON p.fornecedor_id = f.id
      WHERE p.id = ?
    `, [result.insertId]);

    if (newProduct.length === 0) {
      return res.status(404).json({ success: false, message: 'Produto criado mas não encontrado para retorno.'})
    }

    await pool.query(
      'INSERT INTO logs (user_id, username, action_type, description, details) VALUES (?, ?, ?, ?, ?)',
      [
          req.user.id,
          req.user.name,
          'PRODUCT_CREATED',
          `Produto '${newProduct[0].name}' foi cadastrado.`,
          JSON.stringify(newProduct[0])
      ]
    );

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao criar produto', error: error.message });
  }
};

const updateProductQuantity = async (req, res) => {
  const { id } = req.params;
  const { amountChange, details } = req.body;
  const user = req.user;

  if (typeof amountChange !== 'number' || amountChange === 0) {
    return res.status(400).json({ success: false, message: 'A mudança na quantidade deve ser um número diferente de zero.' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [products] = await connection.query('SELECT * FROM produtos WHERE id = ? FOR UPDATE', [id]);
    if (products.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
    }
    const product = products[0];

    let destinationAssetInfo = null;
    if (amountChange < 0) {
      if (!details || !details.destinationAsset) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({ success: false, message: 'O ativo de destino é obrigatório para saídas de estoque.' });
      }

      const [assets] = await connection.query('SELECT id, nome, localizacao FROM assets WHERE nome = ?', [details.destinationAsset]);
      if (assets.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ success: false, message: `Ativo de destino '${details.destinationAsset}' não encontrado.` });
      }
      destinationAssetInfo = assets[0];
    }

    const newQuantity = product.quantity + amountChange;
    if (newQuantity < 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ success: false, message: 'Estoque insuficiente para esta operação.' });
    }
    
    await connection.query('UPDATE produtos SET quantity = ? WHERE id = ?', [newQuantity, id]);

    const logActionType = 'INVENTORY_UPDATED';
    let logDescription = '';
    const logDetails = {
        productId: product.id,
        productName: product.name,
        quantityChange: amountChange,
        newQuantity: newQuantity,
        ...details
    };

    if (amountChange > 0) {
        logDescription = `Adicionadas ${amountChange} unidades ao produto '${product.name}'.`;
    } else {
        logDescription = `Subtraídas ${Math.abs(amountChange)} unidades do produto '${product.name}' para o ativo '${destinationAssetInfo.nome}'.`;
        logDetails.destinationAssetInfo = destinationAssetInfo;
    }

    await connection.query(
        'INSERT INTO logs (user_id, username, action_type, description, details) VALUES (?, ?, ?, ?, ?)',
        [
            user.id,
            user.name,
            logActionType,
            logDescription,
            JSON.stringify(logDetails)
        ]
    );

    await connection.commit();

    const [[updatedProduct]] = await connection.query(`
      SELECT
        p.*,
        c.name as categoryName,
        f.name as fornecedorName
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN fornecedores f ON p.fornecedor_id = f.id
      WHERE p.id = ?
    `, [id]);
    res.json({ success: true, data: updatedProduct });

  } catch (error) {
    await connection.rollback();
    console.error("Erro ao atualizar quantidade:", error);
    res.status(500).json({ success: false, message: error.message || "Erro no servidor." });
  } finally {
    connection.release();
  }
};

// --- FUNÇÃO ADICIONADA ---
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        // Primeiro, busca o produto para logar as informações antes de deletar
        const [[product]] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
        }

        // Executa a deleção
        const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Produto não encontrado.' });
        }

        // Cria o log da exclusão
        await pool.query(
            'INSERT INTO logs (user_id, username, action_type, description, details) VALUES (?, ?, ?, ?, ?)',
            [
                user.id,
                user.name,
                'PRODUCT_DELETED',
                `Produto '${product.name}' (ID: ${product.id}) foi deletado.`,
                JSON.stringify(product)
            ]
        );

        res.json({ success: true, message: 'Produto deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor ao deletar produto.' });
    }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProductQuantity,
  deleteProduct // <-- EXPORTADO
};
