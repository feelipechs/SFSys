export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('distribution_item', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    distribution_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'distribution', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // se a Distribuição sumir, o registro do item deve sumir
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'product', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // não permite excluir um produto que já foi distribuído
    },
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    validity: {
      type: Sequelize.DATE,
    },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });

  // adiciona uma restrição de unicidade composta
  // garante que um produto não seja listado duas vezes na mesma distribuição
  await queryInterface.addConstraint('distribution_item', {
    fields: ['distribution_id', 'product_id'],
    type: 'unique',
    name: 'unique_distribution_product_constraint',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('distribution_item');
}
