export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('distribution_item', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // Chave Estrangeira para a Distribuição (o evento de entrega)
    distribution_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'distribution', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE', // Se a Distribuição sumir, o registro do item deve sumir.
    },
    // Chave Estrangeira para o Produto (o item que saiu do estoque)
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'product', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // Não permite excluir um produto que já foi distribuído.
    },
    // A quantidade do produto distribuída
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    // Colunas padrão de rastreamento
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
  });

  // 🟢 Dica: Adiciona uma restrição de unicidade composta
  // Garante que um produto não seja listado duas vezes na mesma distribuição.
  await queryInterface.addConstraint('distribution_item', {
    fields: ['distribution_id', 'product_id'],
    type: 'unique',
    name: 'unique_distribution_product_constraint',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('distribution_item');
}
