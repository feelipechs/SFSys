import { DataTypes, Model } from 'sequelize';

class Campaign extends Model {
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
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        // Mapeamento snake_case para camelCase
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
        sequelize, // Usa a conexão passada no init
        tableName: 'campaign',
        modelName: 'Campaign',
        timestamps: true, // Garante que created_at/updated_at sejam gerenciados
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
