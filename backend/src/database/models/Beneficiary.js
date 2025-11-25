import { DataTypes, Model } from 'sequelize';

class Beneficiary extends Model {
  // método estático de inicialização: recebe a conexão como parâmetro
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // mapeamento snake_case para camelCase
        responsibleName: {
          type: DataTypes.STRING(80),
          allowNull: false,
          field: 'responsible_name',
        },
        responsibleCpf: {
          type: DataTypes.STRING(11),
          unique: true,
          allowNull: false,
          field: 'responsible_cpf',
        },
        registrationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'registration_date',
        },
        familyMembersCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'family_members_count',
        },
        addressId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'address_id',
        },
      },
      {
        sequelize, // usa a conexão passada no init
        tableName: 'beneficiary',
        modelName: 'Beneficiary',
        timestamps: true, // garante que created_at/updated_at sejam gerenciados
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    this.hasMany(models.Distribution, {
      foreignKey: 'beneficiaryId',
      as: 'distributions',
    });

    this.belongsTo(models.Address, {
      foreignKey: 'addressId',
      as: 'address',
    });
  }
}

export default Beneficiary;
