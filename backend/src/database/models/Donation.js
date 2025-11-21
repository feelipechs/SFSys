import { DataTypes, Model } from 'sequelize';

class Donation extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'date_time',
        },
        observation: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        // foreign keys
        donorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'donor_id',
        },
        responsibleUserId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'responsible_user_id',
        },
        campaignId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'campaign_id',
        },
      },
      {
        sequelize,
        tableName: 'donation',
        modelName: 'Donation',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // 1. A Doação pertence a um Doador (FK: donor_id)
    this.belongsTo(models.Donor, { foreignKey: 'donor_id', as: 'donor' });

    // 2. A Doação pertence a um User (FK: responsible_user_id)
    this.belongsTo(models.User, {
      foreignKey: 'responsibleUserId',
      as: 'responsibleUser',
    });

    // 3. A Doação pertence a uma Campanha (FK: campaign_id)
    this.belongsTo(models.Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });

    // 4. A Doação tem MUITOS Itens de Doação (1:N)
    this.hasMany(models.DonationItem, {
      foreignKey: 'donationId',
      as: 'items',
    });
  }
}

export default Donation;
