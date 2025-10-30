import { DataTypes, Model } from 'sequelize';

class Product extends Model {
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
        name: {
          type: DataTypes.STRING(60),
          allowNull: false,
        },
        // Mapeamento snake_case para camelCase
        unitOfMeasurement: {
          type: DataTypes.STRING(10),
          allowNull: false,
          field: 'unit_of_measurement', // Mapeamento
        },
        currentStock: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
          field: 'current_stock', // Mapeamento
        },
      },
      {
        sequelize, // Usa a conexão passada no init
        tableName: 'product',
        modelName: 'Product',
        timestamps: true, // Assumindo created_at e updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // -------------------------------------------------------------------
    // M:N com Donation, via a tabela intermediária DonationItem
    // -------------------------------------------------------------------

    // 1. Um Produto tem MUITOS Itens de Doação.
    this.hasMany(models.DonationItem, {
      foreignKey: 'product_id',
      as: 'donationItems',
    });

    // 2. Um Produto tem MUITOS Itens de Distribuição.
    this.hasMany(models.DistributionItem, {
      foreignKey: 'product_id',
      as: 'distributionItems',
    });
  }
}

export default Product;
