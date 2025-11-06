import { DataTypes, Model } from 'sequelize';

class DonationItem extends Model {
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
        donationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'donation_id', // Mapeamento
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'product_id', // Mapeamento
        },
        // Campo de Conteúdo
        quantity: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        validity: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize, // Usa a conexão passada no init
        tableName: 'donation_item',
        modelName: 'DonationItem',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // 1. O Item pertence a UMA Doação
    this.belongsTo(models.Donation, {
      foreignKey: 'donation_id',
      as: 'donation',
    });

    // 2. O Item refere-se a UM Produto
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default DonationItem;
