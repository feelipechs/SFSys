import { DataTypes, Model } from 'sequelize';

class DonorLegal extends Model {
  static init(sequelize) {
    super.init(
      {
        donorId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          field: 'donor_id',
        },
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
          allowNull: true,
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
      },
    );
  }

  toJSON() {
    const values = { ...this.get() };
    delete values.donor_id;
    return values;
  }

  static associate(models) {
    // o registro de PJ pertence ao registro pai (donor)
    this.belongsTo(models.Donor, {
      foreignKey: 'donorId',
      as: 'donor',
    });
  }
}

export default DonorLegal;
