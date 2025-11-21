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
    // M:N com Donation, via a tabela intermediária DonationItem

    // Um Produto tem MUITOS Itens de Doação
    this.hasMany(models.DonationItem, {
      foreignKey: 'productId',
      as: 'donationItems',
    });

    // Um Produto tem MUITOS Itens de Distribuição
    this.hasMany(models.DistributionItem, {
      foreignKey: 'productId',
      as: 'distributionItems',
    });
  }
}

export default Product;
