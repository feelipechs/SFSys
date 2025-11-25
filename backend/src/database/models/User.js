import { DataTypes, Model } from 'sequelize';
import { hashPassword } from '../../utils/security.js';
import bcrypt from 'bcryptjs';

class User extends Model {
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

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

        // criptografar senha (bcrypt atualmente)
        hooks: {
          beforeCreate: async (user) => {
            if (user.password) {
              user.password = await hashPassword(user.password);
            }
          },
          beforeUpdate: async (user) => {
            if (user.changed('password')) {
              user.password = await hashPassword(user.password);
            }
          },
        },
      },
    );
  }

  // associações
  static associate(models) {
    this.hasMany(models.Donation, {
      foreignKey: 'responsibleUserId',
      as: 'responsibleDonations',
    });

    this.hasMany(models.Distribution, {
      foreignKey: 'responsibleUserId',
      as: 'deliveredDistributions',
    });

    this.hasMany(models.Notification, {
      foreignKey: 'userId',
      as: 'notifications',
    });
  }
}

export default User;
