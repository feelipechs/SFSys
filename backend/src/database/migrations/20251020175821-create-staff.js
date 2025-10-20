export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('staff', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    login: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING(60), // Para o Hash (bcrypt)
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM('admin', 'manager', 'volunteer'),
      allowNull: false,
      defaultValue: 'volunteer',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('staff');
}
