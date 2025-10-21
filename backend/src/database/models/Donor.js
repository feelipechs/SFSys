import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class Donor extends Model {
  static associate(models) {
    // -----------------------------------------------------
    // 1. Associações de Herança (Table per Subclass)
    // -----------------------------------------------------

    // O Doador Mãe tem UMA (ou nenhuma) Pessoa Física associada.
    // Usamos hasOne para enforcear a regra de que é OU PF OU PJ.
    this.hasOne(models.DonorIndividual, {
      foreignKey: 'donor_id',
      as: 'individual', // Nome mais simples
      onDelete: 'CASCADE',
    });

    // O Doador Mãe tem UMA (ou nenhuma) Pessoa Jurídica associada.
    this.hasOne(models.DonorLegal, {
      foreignKey: 'donor_id',
      as: 'legal', // Nome mais simples
      onDelete: 'CASCADE',
    });

    // -----------------------------------------------------
    // 2. Associação com Doação (1:N)
    // -----------------------------------------------------

    // O Doador fez MUITAS Doações (FK 'donor_id' está na tabela Donation).
    this.hasMany(models.Donation, {
      foreignKey: 'donor_id',
      as: 'donations',
    });
  }
}

Donor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // CAMPO DISCRIMINADOR (Ajuda a saber o tipo rapidamente)
    type: {
      type: DataTypes.ENUM('individual', 'legal'), // PF ou PJ
      allowNull: false,
    },
    name: {
      // Este será o nome do doador (PF ou PJ)
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'donor',
    modelName: 'Donor',
  },
);

export default Donor;
