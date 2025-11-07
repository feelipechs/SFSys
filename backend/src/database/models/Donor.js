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
        // CAMPO DISCRIMINADOR (não requer mapeamento, pois é 'type')
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
          allowNull: true, // assumindo que o phone pode ser nulo
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
    // Associações de Herança (Table per Subclass)

    // Pessoa Física
    this.hasOne(models.DonorIndividual, {
      foreignKey: 'donor_id',
      as: 'individual',
      onDelete: 'CASCADE',
    });

    // Pessoa Jurídica
    this.hasOne(models.DonorLegal, {
      foreignKey: 'donor_id',
      as: 'legal',
      onDelete: 'CASCADE',
    });

    // Associação com Doação (1:N)

    this.hasMany(models.Donation, {
      foreignKey: 'donor_id',
      as: 'donations',
    });
  }
}

export default Donor;
