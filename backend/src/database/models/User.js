import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
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
        email: {
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
        sequelize,
        tableName: 'user',
        modelName: 'User',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        defaultScope: {
          attributes: {
            exclude: ['password'], // exclui a senha de consultas em outros lugares
          },
        },

        // criptografar senha (fornecido pelo gemini, não tenho certeza do quão adequado tá)
        hooks: {
          beforeCreate: async (user) => {
            if (user.password) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
          beforeUpdate: async (user) => {
            if (user.changed('password')) {
              const salt = await bcrypt.genSalt(10);
              user.password = await bcrypt.hash(user.password, salt);
            }
          },
        },
      },
    );
  }

  // associações
  static associate(models) {
    this.hasMany(models.Donation, {
      foreignKey: 'responsible_user_id',
      as: 'responsibleDonations',
    });
    this.hasMany(models.Distribution, {
      foreignKey: 'responsible_user_id',
      as: 'deliveredDistributions',
    });
  }
}

export default User;
