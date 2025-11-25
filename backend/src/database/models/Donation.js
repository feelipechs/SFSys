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
    // a doação pertence a um doador
    this.belongsTo(models.Donor, { foreignKey: 'donor_id', as: 'donor' });

    // a doação pertence a um user
    this.belongsTo(models.User, {
      foreignKey: 'responsibleUserId',
      as: 'responsibleUser',
    });

    // a doação pertence a uma campanha
    this.belongsTo(models.Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });

    // a doação tem muitos itens de doação
    this.hasMany(models.DonationItem, {
      foreignKey: 'donationId',
      as: 'items',
    });
  }
}

export default Donation;
