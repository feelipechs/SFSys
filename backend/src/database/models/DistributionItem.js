import { DataTypes, Model } from 'sequelize';

class DistributionItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // foreign keys
        distributionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'distribution_id',
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'product_id',
        },
        quantity: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        validity: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        tableName: 'distribution_item',
        modelName: 'DistributionItem',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // 1. O Item pertence a UMA Distribuição
    this.belongsTo(models.Distribution, {
      foreignKey: 'distributionId',
      as: 'distribution',
    });

    // 2. O Item refere-se a UM Produto
    this.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export default DistributionItem;
