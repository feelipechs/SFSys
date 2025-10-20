// Usamos require aqui para garantir que o CLI consiga carregar as configs
const path = require('path');
require('dotenv').config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}.local`,
  ),
});

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    // Usando SQLite na memória para testes rápidos
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false, // Desabilitar logs em produção
  },
};
