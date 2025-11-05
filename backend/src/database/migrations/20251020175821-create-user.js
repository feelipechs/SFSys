export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user', {
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
    // CAMPO ROLE: Usa ENUM para as 3 permissões
    role: {
      type: Sequelize.ENUM('admin', 'manager', 'volunteer'),
      allowNull: false,
      defaultValue: 'volunteer', // Padrão: Voluntário (menor privilégio)
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  // Para MySQL, basta remover a tabela. O tipo ENUM é excluído com ela.
  await queryInterface.dropTable('user');
}
