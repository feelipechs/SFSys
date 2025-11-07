import { DataTypes, Model } from 'sequelize';

class DonorLegal extends Model {
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

        // CAMPOS DE DADOS DA PESSOA JURÍDICA
        tradeName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'trade_name',
        },
        cnpj: {
          type: DataTypes.STRING(18),
          allowNull: false,
          unique: true,
        },
        companyName: {
          type: DataTypes.STRING(100),
          allowNull: true, // assumindo que pode ser nulo
          field: 'company_name',
        },
      },
      {
        sequelize,
        tableName: 'donor_legal',
        modelName: 'DonorLegal',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        // id: false é removida, pois donorId já está definido como PK
      },
    );
  }

  static associate(models) {
    // O registro de PJ PERTENCE AO registro pai (Donor)
    this.belongsTo(models.Donor, {
      foreignKey: 'donor_id',
      as: 'donor',
    });
  }
}

export default DonorLegal;
