import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class DonorIndividual extends Model {
  static associate(models) {
    // 1. O registro de PF PERTENCE AO registro Mãe (Donor)
    // A FK é 'donor_id', que também é a PK/FK nesta tabela
    this.belongsTo(models.Donor, {
      foreignKey: 'donor_id',
      as: 'donor', // Nome do alias para buscar o registro mãe
    });
  }
}

DonorIndividual.init(
  {
    donor_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'donor_individual',
    modelName: 'DonorIndividual',
    id: false,
  },
);

export default DonorIndividual;
