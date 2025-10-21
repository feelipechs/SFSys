import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class Product extends Model {
  static associate(models) {
    // -------------------------------------------------------------------
    // M:N com Donation, via a tabela intermediária DonationItem
    // -------------------------------------------------------------------

    // 1. Um Produto tem MUITOS Itens de Doação.
    // Assim que você criar o Model DonationItem, esta linha será ativada:
    this.hasMany(models.DonationItem, {
      foreignKey: 'product_id',
      as: 'donationItems',
    });

    // 2. Um Produto tem MUITOS Itens de Distribuição.
    // Assim que você criar o Model DistributionItem, esta linha será ativada:
    this.hasMany(models.DistributionItem, {
      foreignKey: 'product_id',
      as: 'distributionItems',
    });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    unit_of_measurement: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    current_stock: {
      // O tipo DECIMAL (ou NUMERIC, são sinônimos no PostgreSQL)
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0, // É uma boa prática inicializar estoques
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'product', // nome da tabela usada na migration
    modelName: 'Product',
  },
);

export default Product;
