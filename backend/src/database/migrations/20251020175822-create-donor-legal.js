export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('donor_legal', {
    // PK e FK para pessoa
    donor_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'donor', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    trade_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    cnpj: {
      type: Sequelize.STRING(18),
      allowNull: false,
      unique: true,
    },
    company_name: {
      type: Sequelize.STRING(100),
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('donor_legal');
}
