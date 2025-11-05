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
// Importe todos os seus Models aqui, lembrando do .js!

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

// 1. Cria a instância de conexão
const connection = new Sequelize(config);

// 2. Inicializar Models
const models = [
  Beneficiary,
  Campaign, // Adicionado
  Distribution, // Adicionado
  DistributionItem, // Adicionado
  Donation, // Adicionado
  DonationItem, // Adicionado
  Donor, // Adicionado
  DonorIndividual, // Adicionado
  DonorLegal, // Adicionado
  Product, // Adicionado
  User, // Adicionado
];

// O Doador está comentado no seu código original (/*, Doador */), se for o `Donor`
// que você estava usando, certifique-se de que o nome está correto.

models.forEach((model) => model.init(connection));

// 3. Configurar Associações
models.forEach((model) => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

// Função para checar a conexão (usada no server.js)
export async function connectDB() {
  try {
    await connection.authenticate();
    console.log('✅ Conexão com o Banco de Dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
    throw error;
  }
}

// 4. Exportar
const db = {
  connection,
  ...connection.models, // Exporta todos os Models
  connectDB,
};

export default db;
