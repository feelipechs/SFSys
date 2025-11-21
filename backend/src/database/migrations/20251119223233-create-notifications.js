export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('notification', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'user', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // se o usuário for deletado, suas notificações também serão
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    is_read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    type: {
      // ex: success, warning, info, default (opcional, mas útil para o frontend)
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'default',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('notification');
}
