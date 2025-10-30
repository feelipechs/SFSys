import { DataTypes, Model } from 'sequelize';

class DonorIndividual extends Model {
  // Método estático de inicialização: Recebe a conexão como parâmetro
  static init(sequelize) {
    super.init(
      {
        // CAMPO CHAVE PRIMÁRIA/ESTRANGEIRA (Não auto-increment)
        donorId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          field: 'donor_id', // Mapeamento
        },

        // CAMPOS DE DADOS DA PESSOA FÍSICA
        cpf: {
          type: DataTypes.STRING(14),
          allowNull: false,
          unique: true,
        },
        dateOfBirth: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'date_of_birth', // Mapeamento
        },
      },
      {
        sequelize, // Usa a conexão passada no init
        tableName: 'donor_individual',
        modelName: 'DonorIndividual',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,

        // IMPORTANTE: id: false é desnecessário aqui, pois definimos a PK explicitamente (donorId).
        // Se a PK for uma FK, o auto-increment deve ser evitado (como já está na migration).
        // O Sequelize entende que donorId é a PK.
      },
    );
  }

  static associate(models) {
    // O registro de PF PERTENCE AO registro Mãe (Donor)
    this.belongsTo(models.Donor, {
      foreignKey: 'donor_id',
      as: 'donor',
    });
  }
}

export default DonorIndividual;
