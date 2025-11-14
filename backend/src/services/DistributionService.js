import { BadRequestError, NotFoundError } from '../utils/api-error.js';

class DistributionService {
  constructor(models, productService) {
    if (
      !models ||
      !models.Distribution ||
      !models.DistributionItem ||
      !models.Product ||
      !models.Campaign ||
      !models.sequelize
    ) {
      throw new Error(
        'Modelos (Distribution, DistributionItem, Product e Campaign) e instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Distribution = models.Distribution;
    this.DistributionItem = models.DistributionItem;
    this.Product = models.Product;
    this.Campaign = models.Campaign;
    this.sequelize = models.sequelize;
    this.productService = productService;
  }

  async create(data) {
    // desestruturar array de itens e dados principais da tabela
    const { items, ...distributionBaseData } = data;
    const transaction = await this.sequelize.transaction();

    try {
      if (!items || items.length === 0) {
        throw new BadRequestError(
          'A distribuição deve conter pelo menos um item.',
        );
      }

      const newDistribution = await this.Distribution.create(
        distributionBaseData,
        { transaction },
      );

      // mapea 'itemId' para 'productId'
      const itemsToInsert = items.map((item) => ({
        // aqui mapeia os campos do frontend para o que o backend espera
        productId: item.productId,
        quantity: item.quantity,
        validity: item.validity === '' ? null : item.validity,
        distributionId: newDistribution.id,
      }));

      await this.DistributionItem.bulkCreate(itemsToInsert, {
        transaction,
      });

      // usando o método centralizado do ProductService (DECREMENT)
      // decrementStock vai checar o saldo e decrementar a linha, tudo dentro da transação
      const stockUpdates = itemsToInsert.map((item) => {
        return this.productService.decrementStock(
          item.productId, // usa o campo mapeado 'productId'
          item.quantity,
          transaction,
        );
      });

      // se qualquer um dos decrementStock falhar (por saldo), o Promise.all falha, e o bloco catch faz o rollback
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
        'campaignId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        // beneficiario
        {
          association: 'beneficiary',
        },
        // usuário responsável
        {
          association: 'responsibleUser',
          attributes: ['id', 'name', 'role'],
        },
        {
          association: 'campaign',
        },
        // itens da distribuição
        {
          association: 'items',
          attributes: ['id', 'quantity', 'validity', 'productId'],
          // inclusão aninhada: trazendo o produto associado a cada item
          include: [
            {
              association: 'product',
              attributes: ['id', 'name', 'unitOfMeasurement', 'currentStock'],
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
        'campaignId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        {
          association: 'beneficiary',
        },
        // usuário responsável
        {
          association: 'responsibleUser',
          attributes: ['id', 'name', 'role'],
        },
        {
          association: 'campaign',
          attributes: ['id', 'name', 'startDate', 'endDate'],
        },
        // itens da distribuição
        {
          association: 'items',
          attributes: ['id', 'quantity', 'validity', 'productId'],
          include: [
            {
              association: 'product',
              attributes: ['id', 'name', 'unitOfMeasurement', 'currentStock'],
            },
          ],
        },
      ],
    });

    if (!distribution) {
      throw new NotFoundError(`Distribuição com ID ${id} não encontrada.`);
    }

    return distribution;
  }

  async update(id, data) {
    // filtragem: remove o array 'items' do payload para proibir sua atualização direta
    const { items, ...distributionBaseData } = data;

    // validação: checa se há algum dado para atualizar no cabeçalho
    if (Object.keys(distributionBaseData).length === 0) {
      throw new BadRequestError(
        'Nenhum campo válido fornecido para atualização do cabeçalho da distribuição.',
      );
    }

    // busca e atualiza
    const distribution = await this.findById(id);

    if (data.items) {
      // lança o erro se 'items' estiver presente (não importa se é array vazio ou não)
      throw new BadRequestError(
        'Não é permitido atualizar a lista de itens (produtos e quantidades) de uma doação existente. Apenas dados do cabeçalho (observação, data e campanha) podem ser modificados.',
      );
    }

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
        throw new NotFoundError(`Distribuição com ID ${id} não encontrada.`);
      }

      // reposição de estoque (incremento)
      const itemsToRestore = distribution.items;

      // usando o método centralizado do ProductService (INCREMENT)
      const stockUpdates = itemsToRestore.map((item) => {
        return this.productService.incrementStock(
          item.productId,
          item.quantity,
          transaction, // transação ativa
        );
      });

      await Promise.all(stockUpdates);

      // destruição do registro
      await distribution.destroy({ transaction });

      await transaction.commit();

      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default DistributionService;
