class DistributionService {
  constructor(models) {
    if (
      !models ||
      !models.Distribution ||
      !models.DistributionItem ||
      !models.Product ||
      (!models.connection && !models.sequelize)
    ) {
      throw new Error(
        'Modelos (Distribution, DistributionItem) e instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Distribution = models.Distribution;
    this.DistributionItem = models.DistributionItem;
    this.Product = models.Product;
    this.sequelize = models.connection;
  }

  async create(data) {
    // desestruturar array de itens e dados principais da tabela
    const { items, ...distributionBaseData } = data;
    const transaction = await this.sequelize.transaction();

    try {
      if (!items || items.length === 0) {
        throw new Error('A distribuição deve conter pelo menos um item.');
      }

      // validação de estoque: busca os produtos necessários
      const productIds = items.map((item) => item.productId);

      const products = await this.Product.findAll({
        where: { id: productIds },
        attributes: ['id', 'name', 'currentStock'],
        transaction, // <-- dentro da transação
      });

      const productMap = products.reduce((map, product) => {
        map[product.id] = parseFloat(product.currentStock);
        return map;
      }, {});

      // compara estoque solicitado vs. estoque disponível
      for (const item of items) {
        const availableStock = productMap[item.productId];
        const requestedQuantity = parseFloat(item.quantity);

        if (availableStock === undefined) {
          throw new Error(`Produto com ID ${item.productId} não encontrado.`);
        }

        // condição de falha
        if (availableStock < requestedQuantity) {
          throw new Error(
            `Estoque insuficiente para o produto ${products.find((p) => p.id === item.productId).name}. Disponível: ${availableStock}, Solicitado: ${requestedQuantity}.`,
          );
        }
      }

      // criando o pai (Distribution) primeiro
      const newDistribution = await this.Distribution.create(
        distributionBaseData,
        {
          transaction,
        },
      );

      // criando o objeto do filho (DistributionItem) injetando o id do pai
      const itemsToInsert = items.map((item) => ({
        ...item,
        distributionId: newDistribution.id,
      }));

      // criando os filhos em lote
      await this.DistributionItem.bulkCreate(itemsToInsert, {
        transaction,
      });

      // estoque: decrementando o currentStock (saída)
      // Promise.all para executar todas as atualizações de forma paralela e eficiente
      const stockUpdates = itemsToInsert.map((item) => {
        return this.Product.decrement(
          // coluna a ser decrementada
          { currentStock: item.quantity },
          // condições: onde o ID do produto corresponde ao item
          { where: { id: item.productId }, transaction },
        );
      });

      // espera que todas as atualizações de estoque sejam concluídas (dentro da transação)
      await Promise.all(stockUpdates);
      // fim da lógica de estoque

      await transaction.commit();

      return this.findById(newDistribution.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll() {
    return await this.Distribution.findAll({
      attributes: [
        'id',
        'dateTime',
        'quantityBaskets',
        'observation',
        'beneficiaryId',
        'responsibleUserId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        // usuário responsável
        {
          association: 'responsibleUser',
          attributes: ['id', 'name', 'role'],
        },
        // itens da distribuição
        {
          association: 'items',
          attributes: ['id', 'quantity', 'productId'],
          // INCLUSÃO ANINHADA: Trazendo o Produto associado a CADA Item
          include: [
            {
              association: 'product', // Nome do alias na model DonationItem
              attributes: ['id', 'name', 'unitOfMeasurement', 'currentStock'], // Apenas dados essenciais do Produto
            },
          ],
        },
      ],
      order: [['dateTime', 'DESC']],
    });
  }

  async findById(id, transaction = null) {
    const distribution = await this.Distribution.findByPk(id, {
      attributes: [
        'id',
        'dateTime',
        'quantityBaskets',
        'observation',
        'beneficiaryId',
        'responsibleUserId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        // usuário responsável
        {
          association: 'responsibleUser',
          attributes: ['id', 'name', 'role'],
        },
        // itens da distribuição
        {
          association: 'items',
          attributes: ['id', 'quantity', 'productId'],
          // INCLUSÃO ANINHADA: Trazendo o Produto associado a CADA Item
          include: [
            {
              association: 'product', // Nome do alias na model DonationItem
              attributes: ['id', 'name', 'unitOfMeasurement', 'currentStock'], // Apenas dados essenciais do Produto
            },
          ],
        },
      ],
    });

    if (!distribution) {
      throw new Error(`Distribuição com ID ${id} não encontrado.`);
    }

    return distribution;
  }

  async update(id, data) {
    // filtragem: remove o array 'items' do payload para proibir sua atualização direta
    const { items, ...distributionBaseData } = data;

    // validação: checa se há algum dado para atualizar no cabeçalho
    if (Object.keys(distributionBaseData).length === 0) {
      throw new Error(
        'Nenhum campo válido fornecido para atualização do cabeçalho da distribuição.',
      );
    }

    // busca e atualiza
    const distribution = await this.findById(id);

    // tualiza apenas os campos do cabeçalho (data, observação, etc.)
    await distribution.update(distributionBaseData);

    return distribution;
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();

    try {
      // busca transacional: traz a distribuição com os itens para saber o que repor
      // o include deve trazer 'items' e 'product'
      const distribution = await this.findById(id, transaction);

      if (!distribution) {
        throw new Error(`Distribuição com ID ${id} não encontrada.`);
      }

      // reposição de estoque (incremento)
      const itemsToRestore = distribution.items;

      const stockUpdates = itemsToRestore.map((item) => {
        // usamos increment para somar a quantidade de volta ao estoque
        return this.Product.increment(
          { currentStock: item.quantity },
          { where: { id: item.productId }, transaction },
        );
      });

      await Promise.all(stockUpdates);

      // destruição do registro (pai e filhos)
      await distribution.destroy({ transaction });

      // commit e finalização
      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default DistributionService;
