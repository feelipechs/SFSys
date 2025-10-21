import sequelize from './connection.js';
import Staff from '../models/Staff.js';
import Beneficiary from '../models/Beneficiary.js';
// Importe todos os seus Models aqui!
import Donor from '../models/Donor.js';
import Donation from '../models/Donation.js';
import Distribution from '../models/Distribution.js';
// ... e assim por diante para Campaign, Product, DonationItem, DistributionItem

// Crie um objeto com todos os Models
const models = {
  Staff,
  Beneficiary,
  Donor,
  Donation,
  Distribution,
  // ... adicione os restantes
};

// --------------------------------------------------------
// 1. Sincronizar Associações
// --------------------------------------------------------

// Este loop passa por todos os Models e executa o método 'associate'
// que você definiu (ex: Staff.associate = function(models) { ... })
Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

// --------------------------------------------------------
// 2. Exportar
// --------------------------------------------------------

// Exportamos o objeto 'db' que contém a conexão e todos os Models
export const db = {
  sequelize,
  Sequelize: sequelize.Sequelize,
  ...models,
};

// Função para testar a conexão
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o Banco de Dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
    // Em um projeto real, você pode querer sair do processo aqui:
    // process.exit(1);
  }
}
