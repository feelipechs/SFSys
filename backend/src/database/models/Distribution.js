import { DataTypes, Model } from 'sequelize';

class Distribution extends Model {
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
        quantityBaskets: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'quantity_baskets',
        },
        observation: {
          type: DataTypes.TEXT,
          allowNull: true, // TEXT geralmente permite null, a menos que especificado
        },
        beneficiaryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'beneficiary_id',
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
        tableName: 'distribution',
        modelName: 'Distribution',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // a distribuição pertence a um user
    this.belongsTo(models.User, {
      foreignKey: 'responsibleUserId',
      as: 'responsibleUser',
    });

    // a distribuição pertence a um beneficiário
    this.belongsTo(models.Beneficiary, {
      foreignKey: 'beneficiaryId',
      as: 'beneficiary',
    });

    // 3. A Distribuição pertence a uma Campanha (FK: campaign_id) ou não
    this.belongsTo(models.Campaign, {
      foreignKey: 'campaignId',
      as: 'campaign',
    });

    // 4. A Distribuição tem MUITOS Itens de Distribuição (1:N)
    this.hasMany(models.DistributionItem, {
      foreignKey: 'distributionId',
      as: 'items',
    });
  }
}

export default Distribution;
