import { Sequelize } from 'sequelize';

// A opção 'storage' define o caminho para o arquivo do banco de dados
// Use storage: ':memory:' para um banco de dados temporário em memória
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './cursify_database.sqlite',
  logging: false, // Opcional: desativa o log das consultas SQL no console
});

export default sequelize;
