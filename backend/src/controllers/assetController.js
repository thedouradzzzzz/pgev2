const pool = require('../config/database');
const csv = require('csv-parser');
const stream = require('stream');

const getAllAssets = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id,
        a.nome,
        a.fabricante,
        a.numero_serie,
        a.tipo,
        a.modelo,
        a.descricao,
        a.localizacao,
        a.responsavel_id,
        u.name as assignedToUsername
      FROM assets a
      LEFT JOIN users u ON a.responsavel_id = u.id
      ORDER BY a.nome ASC
    `;
    const [assets] = await pool.query(sql);
    res.status(200).json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    console.error('Erro ao buscar ativos:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao buscar ativos.' });
  }
};

const getAssetById = async (req, res) => {
  try {
    const [assets] = await pool.query('SELECT * FROM assets WHERE id = ?', [req.params.id]);
    if (assets.length === 0) {
      return res.status(404).json({ success: false, message: 'Ativo não encontrado.' });
    }
    res.status(200).json({ success: true, data: assets[0] });
  } catch (error) {
    console.error('Erro ao buscar ativo por ID:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor.' });
  }
};

const createAsset = async (req, res) => {
  const { nome, descricao, localizacao, responsavel_id, fabricante, numero_serie, tipo, modelo } = req.body;
  if (!nome) {
    return res.status(400).json({ success: false, message: 'O campo "nome" é obrigatório.' });
  }
  try {
    const sql = 'INSERT INTO assets (nome, descricao, localizacao, responsavel_id, fabricante, numero_serie, tipo, modelo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(sql, [nome, descricao, localizacao, responsavel_id, fabricante, numero_serie, tipo, modelo]);
    const [[newAsset]] = await pool.query('SELECT * FROM assets WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newAsset });
  } catch (error) {
    console.error('Erro ao criar ativo:', error);
    res.status(400).json({ success: false, message: 'Erro ao criar ativo.', error: error.message });
  }
};

const updateAsset = async (req, res) => {
  const { nome, descricao, localizacao, responsavel_id, fabricante, numero_serie, tipo, modelo } = req.body;
  if (!nome) {
    return res.status(400).json({ success: false, message: 'O campo "nome" é obrigatório.' });
  }
  try {
    const sql = 'UPDATE assets SET nome = ?, descricao = ?, localizacao = ?, responsavel_id = ?, fabricante = ?, numero_serie = ?, tipo = ?, modelo = ? WHERE id = ?';
    const [result] = await pool.query(sql, [nome, descricao, localizacao, responsavel_id, fabricante, numero_serie, tipo, modelo, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ativo não encontrado para atualização.' });
    }
    const [[updatedAsset]] = await pool.query('SELECT * FROM assets WHERE id = ?', [req.params.id]);
    res.status(200).json({ success: true, data: updatedAsset });
  } catch (error) {
    console.error('Erro ao atualizar ativo:', error);
    res.status(400).json({ success: false, message: 'Erro ao atualizar ativo.', error: error.message });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM assets WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ativo não encontrado.' });
    }
    res.status(200).json({ success: true, message: 'Ativo deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar ativo:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor ao deletar ativo.' });
  }
};

const importAssets = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
  }

  const results = [];
  const errors = [];
  let successfullyAdded = 0;
  let successfullyUpdated = 0;
  
  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  const connection = await pool.getConnection();

  bufferStream
    .pipe(csv({ 
        separator: ';', 
        mapHeaders: ({ header }) => header.replace(/[﻿"]/g, '') 
    }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      if (results.length === 0) {
        connection.release();
        return res.status(400).json({ success: false, message: 'Arquivo CSV vazio ou em formato inválido.' });
      }
      
      try {
        await connection.beginTransaction();

        for (const asset of results) {
          const serialNumber = asset['Número de série'] || null;
          if (!serialNumber || serialNumber.trim() === '') {
            errors.push(`Linha com nome '${asset['Nome'] || 'N/A'}' ignorada: Número de série ausente.`);
            continue;
          }

          const assetData = {
            nome: asset['Nome'] || 'Nome não especificado',
            fabricante: asset['Fabricante'] || null,
            numero_serie: serialNumber,
            tipo: asset['Tipo'] || null,
            modelo: asset['Modelo'] || null,
            localizacao: asset['Nome alternativo do usuário'] || null,
            descricao: `CPU: ${asset['Componentes - Processador'] || 'N/A'}; RAM: ${asset['Componentes - Memória'] || 'N/A'}; OS: ${asset['Sistema operacional - Nome'] || 'N/A'}`
          };
          
          const sql = `
            INSERT INTO assets (nome, fabricante, numero_serie, tipo, modelo, localizacao, descricao)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            nome = VALUES(nome),
            fabricante = VALUES(fabricante),
            tipo = VALUES(tipo),
            modelo = VALUES(modelo),
            localizacao = VALUES(localizacao),
            descricao = VALUES(descricao);
          `;
          
          const [result] = await connection.query(sql, Object.values(assetData));
          
          if (result.affectedRows === 1) {
            successfullyAdded++;
          } else if (result.affectedRows >= 2) {
            successfullyUpdated++;
          }
        }

        // <-- LÓGICA DE LOG ADICIONADA AQUI -->
        const logDescription = `Importação de ativos via CSV concluída.`;
        const logDetails = {
            fileName: req.file.originalname,
            added: successfullyAdded,
            updated: successfullyUpdated,
            errors: errors.length
        };

        await connection.query(
            'INSERT INTO logs (user_id, username, action_type, description, details) VALUES (?, ?, ?, ?, ?)',
            [
                req.user.id,
                req.user.name,
                'ASSET_IMPORT', // Tipo de ação
                logDescription,
                JSON.stringify(logDetails)
            ]
        );
        // <-- FIM DA LÓGICA DE LOG -->

        await connection.commit();
        res.status(200).json({
          success: true,
          message: 'Importação concluída.',
          data: { successfullyAdded, successfullyUpdated, errors }
        });

      } catch (error) {
        await connection.rollback();
        console.error('Erro durante a transação de importação:', error);
        if (error.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ success: false, message: `Erro de duplicidade no banco de dados. Verifique o campo "Número de série": ${error.message}` });
        } else {
          res.status(500).json({ success: false, message: 'Erro no servidor durante a importação.', error: error.message });
        }
      } finally {
        connection.release();
      }
    });
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  importAssets
};
