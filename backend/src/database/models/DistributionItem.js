import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class DistributionItem extends Model {
  static associate(models) {
    // 1. O Item pertence a UMA Distribuição (Correto)
    this.belongsTo(models.Distribution, {
      foreignKey: 'distribution_id',
      as: 'distribution',
    });

    // 2. O Item refere-se a UM Produto (FALTAVA!)
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

DistributionItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    distribution_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'distribution_item', // nome da tabela usada na migration
    modelName: 'DistributionItem',
  },
);

export default DistributionItem;
