import { Sequelize } from 'sequelize';
import config from '../config/index.js'; // Importação normal

// Define as opções de conexão
const options = {
  dialect: config.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
  // Se for test, usa storage na memória, senão usa a URL do Postgre
  storage: config.NODE_ENV === 'test' ? config.DB_STORAGE_TEST : undefined,
  logging: config.NODE_ENV === 'development' ? console.log : false,
};

// Se não for teste, usamos a URL do Postgre
const sequelize =
  config.NODE_ENV === 'test'
    ? new Sequelize(options)
    : new Sequelize(config.DATABASE_URL, options);

// ... (Aqui você importa os Models e faz as associações)

export default sequelize; // Exporta a instância para ser usada nos Services
