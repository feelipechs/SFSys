import { DataTypes, Model } from 'sequelize';

class Beneficiary extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        responsibleName: {
          type: DataTypes.STRING(80),
          allowNull: false,
          field: 'responsible_name',
        },
        registrationDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'registration_date',
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        familyMembersCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'family_members_count',
        },
      },
      {
        sequelize,
        tableName: 'beneficiary',
        modelName: 'Beneficiary',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    this.hasMany(models.Distribution, {
      foreignKey: 'beneficiary_id',
      as: 'distributions',
    });
  }
}

export default Beneficiary;
