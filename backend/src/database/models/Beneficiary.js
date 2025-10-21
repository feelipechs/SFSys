import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../connection.js';

class Beneficiary extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  static associate(models) {
    this.hasMany(models.Distribution, { foreignKey: 'beneficiary_id' });
  }
}

Beneficiary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // CAMPOS DE LOGIN
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    // CAMPOS DO DIAGRAMA
    responsible_name: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family_members_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'beneficiary', // nome da tabela usada na migration
    modelName: 'Beneficiary',
    // ----------------------------------------------------
    // HOOK: Esta função é executada ANTES de salvar no DB
    // ----------------------------------------------------
    hooks: {
      beforeCreate: async (beneficiary) => {
        // Criptografa a senha antes de salvar
        if (beneficiary.password) {
          const salt = await bcrypt.genSalt(10);
          beneficiary.password = await bcrypt.hash(beneficiary.password, salt);
        }
      },
      beforeUpdate: async (beneficiary) => {
        // Criptografa a senha se ela foi modificada
        if (beneficiary.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          beneficiary.password = await bcrypt.hash(beneficiary.password, salt);
        }
      },
    },
  },
);

export default Beneficiary;
