import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Staff extends Model {
  // método para comparação de senha (usado no login)
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // método estático de inicialização (padrão moderno)
  static init(sequelize) {
    super.init(
      {
        id: {
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
          type: DataTypes.ENUM('admin', 'manager', 'volunteer'),
          allowNull: false,
          defaultValue: 'volunteer',
        },
      },
      {
        sequelize, // conexão passada pelo database/index.js
        tableName: 'staff',
        modelName: 'Staff',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,

        // criptografar senha
        hooks: {
          beforeCreate: async (staff) => {
            if (staff.password) {
              const salt = await bcrypt.genSalt(10);
              staff.password = await bcrypt.hash(staff.password, salt);
            }
          },
          beforeUpdate: async (staff) => {
            if (staff.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              staff.password = await bcrypt.hash(staff.password, salt);
            }
          },
        },
      },
    );
  }

  // Associações
  static associate(models) {
    this.hasMany(models.Donation, {
      foreignKey: 'responsible_staff_id',
      as: 'responsibleDonations',
    });
    this.hasMany(models.Distribution, {
      foreignKey: 'delivery_staff_id',
      as: 'deliveredDistributions',
    });
  }
}

export default Staff;
