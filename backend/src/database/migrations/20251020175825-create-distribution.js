export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('distribution', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    quantity_baskets: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    observation: {
      type: Sequelize.TEXT,
    },
    beneficiary_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'beneficiary', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    responsible_user_id: {
      type: Sequelize.INTEGER,
      // Usar SET NULL aqui é recomendado para manter o histórico
      allowNull: true,
      references: { model: 'user', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    campaign_id: {
      type: Sequelize.INTEGER,
      // Se nem toda distribuição for resultado de uma campanha, use allowNull: true
      allowNull: true,
      references: { model: 'campaign', key: 'id' },
      onUpdate: 'CASCADE',
      // Se a campanha for excluída, desassocia a distribuição, mantendo o histórico
      onDelete: 'SET NULL',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('distribution');
}
