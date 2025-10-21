import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class DonorLegal extends Model {
  static associate(models) {
    // 1. O registro de PJ PERTENCE AO registro Mãe (Donor)
    // A FK é 'donor_id', que também é a PK/FK nesta tabela
    this.belongsTo(models.Donor, {
      foreignKey: 'donor_id',
      as: 'donor', // Nome do alias para buscar o registro mãe
    });
  }
}

DonorLegal.init(
  {
    donor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    trade_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(18),
      allowNull: false,
      unique: true,
    },
    company_name: {
      type: DataTypes.STRING(100),
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'donor_legal',
    modelName: 'DonorLegal',
    id: false,
  },
);

export default DonorLegal;
