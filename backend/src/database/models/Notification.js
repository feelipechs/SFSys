import { DataTypes, Model } from 'sequelize';

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isRead: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'is_read',
        },
        type: {
          type: DataTypes.STRING(20),
          allowNull: false,
          defaultValue: 'default',
        },
      },
      {
        sequelize,
        tableName: 'notification',
        modelName: 'Notification',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // uma notificação pertence a um usuário
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'recipient' });
  }
}

export default Notification;
