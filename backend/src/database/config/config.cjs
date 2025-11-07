const path = require('path');
const dotenv = require('dotenv');

// carregamento inteligente do .env para o CLI
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}${nodeEnv === 'development' ? '.local' : ''}`;
const envPath = path.resolve(process.cwd(), envFile);

// garante que o .env correto seja lido, mesmo que rodando apenas o comando 'npx sequelize-cli'
dotenv.config({ path: envPath });

// objeto de configuração para sequelize CLI
module.exports = {
  // ambiente de desenvolvimento (MySQL local)
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // loggin: true // opcional: para ver as queries SQL
  },

  // ambiente de teste (SQLite na memória)
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // ideal para testes rápidos, pois não toca o disco
    logging: false, // sem logs de queries durante os testes
  },

  // ambiente de produção (MySQL remoto)
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // desabilita logs de queries em produção
    dialectOptions: {
      // opcional: configurações de segurança para alguns provedores de nuvem
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false
      // }
    },
  },
};
