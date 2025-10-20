export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('donation', {
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
    observation: {
      type: Sequelize.TEXT,
    },
    donor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'donor', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    responsible_staff_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'staff', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    campaign_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'campaign', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('donation');
}
