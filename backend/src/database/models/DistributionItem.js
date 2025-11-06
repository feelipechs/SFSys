import { DataTypes, Model } from 'sequelize';

class DistributionItem extends Model {
  // Método estático de inicialização: Recebe a conexão como parâmetro
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // Foreign Keys (Mapeamento explícito para camelCase)
        distributionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'distribution_id', // Mapeamento
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'product_id', // Mapeamento
        },
        quantity: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize, // Usa a conexão passada no init
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
      foreignKey: 'distribution_id',
      as: 'distribution',
    });

    // 2. O Item refere-se a UM Produto
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export default DistributionItem;
