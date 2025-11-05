export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('product', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(60),
      allowNull: false,
    },
    unit_of_measurement: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    current_stock: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0, // É uma boa prática inicializar estoques
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('product');
}
