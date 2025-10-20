export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('donation_item', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    validity: {
      type: Sequelize.DATE,
    },
    donation_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'donation', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'product', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('donation_item');
}
