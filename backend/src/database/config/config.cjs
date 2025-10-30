const path = require('path');
const dotenv = require('dotenv');

// --- 1. Carregamento Inteligente do .env para o CLI ---
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}${nodeEnv === 'development' ? '.local' : ''}`;
const envPath = path.resolve(process.cwd(), envFile);

// Garante que o .env correto seja lido, mesmo que rodando apenas o comando 'npx sequelize-cli'
dotenv.config({ path: envPath });

// --- 2. Objeto de Configuração para Sequelize CLI ---
module.exports = {
  // Ambiente de Desenvolvimento (MySQL local)
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // loggin: true // Opcional: para ver as queries SQL
  },

  // Ambiente de Teste (SQLite na memória)
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // Ideal para testes rápidos, pois não toca o disco
    logging: false, // Sem logs de queries durante os testes
  },

  // Ambiente de Produção (MySQL remoto)
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Desabilita logs de queries em produção
    dialectOptions: {
      // Opcional: configurações de segurança para alguns provedores de nuvem
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    },
  },
};
