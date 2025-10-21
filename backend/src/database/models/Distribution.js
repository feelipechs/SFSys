import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class Distribution extends Model {
  static associate(models) {
    // 1. A Distribuição PERTENCE A UM Staff (N:1)
    // A FK é 'delivery_staff_id' e aponta para models.Staff.
    this.belongsTo(models.Staff, {
      foreignKey: 'delivery_staff_id',
      as: 'deliveryStaff',
    });

    // 2. A Distribuição PERTENCE A UM Beneficiário (N:1)
    // A FK é 'beneficiary_id' e aponta para models.Beneficiary.
    this.belongsTo(models.Beneficiary, {
      foreignKey: 'beneficiary_id',
      as: 'beneficiary',
    });

    // 3. A Distribuição tem MUITOS Itens de Distribuição (1:N)
    this.hasMany(models.DistributionItem, {
      foreignKey: 'distribution_id',
      as: 'items',
    });
  }
}

Distribution.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity_baskets: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    observation: {
      type: DataTypes.TEXT,
    },
    beneficiary_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    delivery_staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'distribution', // nome da tabela usada na migration
    modelName: 'Distribution',
  },
);

export default Distribution;
