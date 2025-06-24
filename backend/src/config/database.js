const mysql = require('mysql2/promise');

// Cria um "pool" de conexões usando as variáveis do nosso arquivo .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa a conexão para garantir que tudo está funcionando
pool.getConnection()
  .then(connection => {
    console.log('MySQL Conectado com sucesso!');
    connection.release(); // Libera a conexão de volta para o pool
  })
  .catch(err => {
    console.error('ERRO AO CONECTAR AO BANCO DE DADOS:', err);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  });

// Exporta o pool para que outras partes da aplicação possam usá-lo
module.exports = pool;
