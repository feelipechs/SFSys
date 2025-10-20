export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('beneficiary', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // CAMPOS DE LOGIN
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    // CAMPOS DO DIAGRAMA
    responsible_name: {
      type: Sequelize.STRING(80),
      allowNull: false,
    },
    registration_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    family_members_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('beneficiary');
}
