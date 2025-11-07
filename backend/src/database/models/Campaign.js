import { DataTypes, Model } from 'sequelize';

class Campaign extends Model {
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
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'start_date',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'end_date',
        },
      },
      {
        sequelize,
        tableName: 'campaign',
        modelName: 'Campaign',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // 1. Uma campanha tem muitas doações
    this.hasMany(models.Donation, {
      foreignKey: 'campaign_id',
      as: 'donations',
    });

    // 2. Associações com Distribuições (Se houver uma FK 'campaign_id' na Distribution)
    // this.hasMany(models.Distribution, { foreignKey: 'campaign_id', as: 'distributions' });
  }
}

export default Campaign;
