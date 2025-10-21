import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class DonationItem extends Model {
  static associate(models) {
    // 1. O Item pertence a UMA Doação (FK: donation_id)
    this.belongsTo(models.Donation, {
      foreignKey: 'donation_id',
      as: 'donation',
    });

    // 2. O Item refere-se a UM Produto (FK: product_id)
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

DonationItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // Chaves Estrangeiras
    donation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Campo de Conteúdo
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'donation_item', // nome da tabela usada na migration
    modelName: 'DonationItem',
  },
);

export default DonationItem;
