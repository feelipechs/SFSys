import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../connection.js'; // Assumindo que você exportou a conexão aqui

class Staff extends Model {
  /**
   * Compara a senha fornecida com o hash salvo no banco de dados.
   * @param {string} candidatePassword Senha fornecida no login (plain text).
   * @returns {Promise<boolean>} Retorna true se as senhas coincidirem.
   */
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Método estático para aplicar as associações (FKs)
  static associate(models) {
    // Exemplo: Staff é responsável por várias doações e distribuições
    this.hasMany(models.Donation, { foreignKey: 'responsible_staff_id' });
    this.hasMany(models.Distribution, { foreignKey: 'delivery_staff_id' });
  }
}

Staff.init(
  {
    id: {
      // Usando 'id' como PK, seguindo a convenção
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    role: {
      // Usando 'role' em vez de perfil_acesso (se você usou ENUM na migration, use o mesmo nome aqui)
      type: DataTypes.ENUM('admin', 'manager', 'volunteer'),
      allowNull: false,
      defaultValue: 'volunteer',
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'staff', // Nome da tabela que você usou na migration
    modelName: 'Staff',
    // ----------------------------------------------------
    // HOOK: Esta função é executada ANTES de salvar no DB
    // ----------------------------------------------------
    hooks: {
      beforeCreate: async (staff) => {
        // Criptografa a senha antes de salvar
        if (staff.password) {
          const salt = await bcrypt.genSalt(10);
          staff.password = await bcrypt.hash(staff.password, salt);
        }
      },
      beforeUpdate: async (staff) => {
        // Criptografa a senha se ela foi modificada
        if (staff.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          staff.password = await bcrypt.hash(staff.password, salt);
        }
      },
    },
  },
);

export default Staff;
