export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('refresh_tokens', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    token: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    expires_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  // adiciona índices para melhor performance
  await queryInterface.addIndex('refresh_tokens', ['user_id'], {
    name: 'idx_refresh_tokens_user_id',
  });

  await queryInterface.addIndex('refresh_tokens', ['token'], {
    name: 'idx_refresh_tokens_token',
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('refresh_tokens');
}
