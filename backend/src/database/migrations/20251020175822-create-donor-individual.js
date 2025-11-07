export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('donor_individual', {
    // PK e FK para pessoa
    donor_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'donor', key: 'id' }, // CHAVE ESTRANGEIRA
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    cpf: {
      type: Sequelize.STRING(11),
      allowNull: false,
      unique: true,
    },
    date_of_birth: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('donor_individual');
}
