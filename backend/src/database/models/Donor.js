import { DataTypes, Model } from 'sequelize';

class Donor extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // não requer mapeamento, pois é type
        type: {
          type: DataTypes.ENUM('individual', 'legal'), // PF ou PJ
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(80),
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'donor',
        modelName: 'Donor',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // associações de herança

    // pessoa física
    this.hasOne(models.DonorIndividual, {
      foreignKey: 'donorId',
      as: 'individual',
      onDelete: 'CASCADE',
    });

    // pessoa jurídica
    this.hasOne(models.DonorLegal, {
      foreignKey: 'donorId',
      as: 'legal',
      onDelete: 'CASCADE',
    });

    // associação com doação
    this.hasMany(models.Donation, {
      foreignKey: 'donorId',
      as: 'donations',
    });
  }
}

export default Donor;
