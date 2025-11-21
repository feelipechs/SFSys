import { DataTypes, Model } from 'sequelize';

class RefreshToken extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        token: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'expires_at',
        },
      },
      {
        sequelize,
        tableName: 'refresh_tokens',
        modelName: 'RefreshToken',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        underscored: true,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }

  // método para verificar se o token expirou
  isExpired() {
    return new Date() > this.expiresAt;
  }
}

export default RefreshToken;
