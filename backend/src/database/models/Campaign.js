import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class Campaign extends Model {
  static associate(models) {
    // 1. Uma campanha tem muitas doações
    this.hasMany(models.Donation, {
      foreignKey: 'campaign_id',
      as: 'donation',
    });

    // 2. Associações com Distribuições (Se houver uma FK 'campaign_id' na Distribution)
    // Se uma distribuição pode ser rastreada até uma campanha, adicione:
    // this.hasMany(models.Distribution, { foreignKey: 'campaign_id', as: 'distributions' });
  }
}

Campaign.init(
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
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'campaign', // nome da tabela usada na migration
    modelName: 'Campaign',
  },
);

export default Campaign;
