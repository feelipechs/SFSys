import { DataTypes, Model } from 'sequelize';

class DonorLegal extends Model {
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

        // CAMPOS DE DADOS DA PESSOA JURÍDICA
        tradeName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'trade_name', // Mapeamento
        },
        cnpj: {
          type: DataTypes.STRING(18),
          allowNull: false,
          unique: true,
        },
        companyName: {
          type: DataTypes.STRING(100),
          allowNull: true, // Assumindo que pode ser nulo
          field: 'company_name', // Mapeamento
        },
      },
      {
        sequelize, // Usa a conexão passada no init
        tableName: 'donor_legal',
        modelName: 'DonorLegal',
        timestamps: true, // Assumindo created_at e updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        // A opção 'id: false' é removida, pois 'donorId' já está definido como PK
      },
    );
  }

  static associate(models) {
    // O registro de PJ PERTENCE AO registro Mãe (Donor)
    this.belongsTo(models.Donor, {
      foreignKey: 'donor_id',
      as: 'donor',
    });
  }
}

export default DonorLegal;
