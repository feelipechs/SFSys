import { DataTypes, Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
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
        unitOfMeasurement: {
          type: DataTypes.STRING(10),
          allowNull: false,
          field: 'unit_of_measurement',
        },
        currentStock: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
          field: 'current_stock',
        },
        category: {
          type: DataTypes.ENUM('food', 'clothing', 'hygiene', 'others'),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'product',
        modelName: 'Product',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // M:N com donation, via a tabela intermediária DonationItem
    // um produto tem muitos itens de doação
    this.hasMany(models.DonationItem, {
      foreignKey: 'productId',
      as: 'donationItems',
    });

    // um produto tem muitos itens de distribuição
    this.hasMany(models.DistributionItem, {
      foreignKey: 'productId',
      as: 'distributionItems',
    });
  }
}

export default Product;
