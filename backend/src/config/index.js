import dotenv from 'dotenv';

// Ajustado para buscar o .env.[ambiente].local
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}.local`;

// Carrega o arquivo de ambiente
dotenv.config({ path: envFile });

const config = {
  // Configurações Gerais
  NODE_ENV: nodeEnv,
  PORT: process.env.PORT || 3000,

  // Configuração de Segurança
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '1h',

  // Configuração do Banco de Dados PostgreSQL
  DATABASE_URL: process.env.DATABASE_URL,

  // Caminho de Storage para testes (SQLite)
  DB_STORAGE_TEST: process.env.DB_STORAGE_TEST || ':memory:',
};

export default config;
