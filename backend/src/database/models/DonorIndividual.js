import { DataTypes, Model } from 'sequelize';

class DonorIndividual extends Model {
  static init(sequelize) {
    super.init(
      {
        // CAMPO CHAVE PRIMÁRIA/ESTRANGEIRA (não auto-increment)
        donorId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          field: 'donor_id',
        },

        // CAMPOS DE DADOS DA PESSOA FÍSICA
        cpf: {
          type: DataTypes.STRING(11),
          allowNull: false,
          unique: true,
        },
        dateOfBirth: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'date_of_birth',
        },
      },
      {
        sequelize,
        tableName: 'donor_individual',
        modelName: 'DonorIndividual',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,

        // id: false é desnecessário aqui, pois definimos a PK explicitamente (donorId)
        // Se a PK for uma FK, o auto-increment deve ser evitado (como já está na migration)
        // O Sequelize entende que donorId é a PK
      },
    );
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.donor_id;
    return values;
  }

  static associate(models) {
    // O registro de PF PERTENCE AO registro pai (Donor)
    this.belongsTo(models.Donor, {
      foreignKey: 'donor_id',
      as: 'donor',
    });
  }
}

export default DonorIndividual;
