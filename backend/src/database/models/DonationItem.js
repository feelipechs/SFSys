import { DataTypes, Model } from 'sequelize';

class DonationItem extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        donationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'donation_id',
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
    // o item pertence a uma doação
    this.belongsTo(models.Donation, {
      foreignKey: 'donationId',
      as: 'donation',
    });

    // o item refere-se a um produto
    this.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

export default DonationItem;
