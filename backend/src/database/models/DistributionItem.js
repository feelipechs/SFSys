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
    // o item pertence a uma distribuição
    this.belongsTo(models.Distribution, {
      foreignKey: 'distributionId',
      as: 'distribution',
    });

    // o item refere-se a um produto
    this.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export default DistributionItem;
