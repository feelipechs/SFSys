import Sequelize from 'sequelize';
import dbConfig from './config/config.cjs';
import Beneficiary from './models/Beneficiary.js';
import Campaign from './models/Campaign.js';
import Distribution from './models/Distribution.js';
import DistributionItem from './models/DistributionItem.js';
import Donation from './models/Donation.js';
import DonationItem from './models/DonationItem.js';
import Donor from './models/Donor.js';
import DonorIndividual from './models/DonorIndividual.js';
import DonorLegal from './models/DonorLegal.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Notification from './models/Notification.js';
import RefreshToken from './models/RefreshToken.js';

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

// cria a instância de conexão
const sequelize = new Sequelize(config);

// inicializar Models
const models = [
  Beneficiary,
  Campaign,
  Distribution,
  DistributionItem,
  Donation,
  DonationItem,
  Donor,
  DonorIndividual,
  DonorLegal,
  Product,
  User,
  Notification,
  RefreshToken,
];

models.forEach((model) => model.init(sequelize));

// configurar associações
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

// função para checar a conexão (usada no server.js)
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o Banco de Dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
    throw error;
  }
}

// exportar
const db = {
  sequelize,
  ...sequelize.models, // exporta todos os Models
  connectDB,
};

export default db;
