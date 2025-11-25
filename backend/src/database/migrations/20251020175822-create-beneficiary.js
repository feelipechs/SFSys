export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('beneficiary', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    responsible_name: {
      type: Sequelize.STRING(80),
      allowNull: false,
    },
    responsible_cpf: {
      type: Sequelize.STRING(11),
      allowNull: false,
      unique: true,
    },
    registration_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    family_members_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    address_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'address',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('beneficiary');
}
