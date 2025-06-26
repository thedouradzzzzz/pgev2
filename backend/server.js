require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');

// Conectar ao banco de dados
//connectDB();

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const produtoRoutes = require('./src/routes/produtoRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const fornecedorRoutes = require('./src/routes/fornecedorRoutes');
const entradaEstoqueRoutes = require('./src/routes/entradaEstoqueRoutes');
const saidaEstoqueRoutes = require('./src/routes/saidaEstoqueRoutes');
const userRoutes = require('./src/routes/userRoutes');
const assetRoutes = require('./src/routes/assetRoutes');
const descriptorRoutes = require('./src/routes/descriptorRoutes');
const logRoutes = require('./src/routes/logRoutes'); // <-- ADICIONADO

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Montar as rotas
app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/entradas', entradaEstoqueRoutes);
app.use('/api/saidas', saidaEstoqueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/descriptors', descriptorRoutes);
app.use('/api/logs', logRoutes); // <-- ADICIONADO

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do Gerenciamento de Estoque está rodando...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`--- ESTOU EXECUTANDO O ARQUIVO CORRETO --- Servidor na porta ${PORT}`); // <-- MUDANÇA AQUI
});
