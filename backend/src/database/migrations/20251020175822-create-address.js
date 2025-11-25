export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('address', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cep: {
      type: Sequelize.STRING(8),
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING(2),
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    neighborhood: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    street: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    number: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },
    complement: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    latitude: {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('address');
}
