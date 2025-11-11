import { BadRequestError, NotFoundError } from '../utils/api-error.js';

class DonationService {
  constructor(models) {
    if (
      !models ||
      !models.Donation ||
      !models.DonationItem ||
      !models.Product ||
      !models.Campaign ||
      !models.sequelize
    ) {
      throw new Error(
        'Modelos (Donation, DonationItem, Product e Campaign) e instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Donation = models.Donation;
    this.DonationItem = models.DonationItem;
    this.Product = models.Product;
    this.Campaign = models.Campaign;
    this.sequelize = models.sequelize;
  }

  async create(data) {
    // desestruturar array de itens e dados principais da tabela
    const { items, ...donationBaseData } = data;

    // validar status da campanha
    if (donationBaseData.campaignId) {
      const campaign = await this.Campaign.findByPk(
        donationBaseData.campaignId,
      );

      if (!campaign) {
        throw new NotFoundError(
          `Campanha com ID ${donationBaseData.campaignId} não encontrada.`,
        );
      }

      // apenas permita doações se o status for inProgress
      if (campaign.status !== 'inProgress') {
        throw new BadRequestError(
          `Não é possível registrar doações para a campanha "${campaign.name}". O status atual é "${campaign.status}".`,
        );
      }
    }

    const transaction = await this.sequelize.transaction();

    try {
      if (!items || items.length === 0) {
        throw new BadRequestError('A doação deve conter pelo menos um item.');
      }

      // criando o pai (Donation) primeiro
      const newDonation = await this.Donation.create(donationBaseData, {
        transaction,
      });

      // criando o objeto do filho (DonationItem) injetando o id do pai
      const itemsToCreate = items.map((item) => ({
        ...item,
        donationId: newDonation.id,
      }));

      // criando os filhos em lote
      await this.DonationItem.bulkCreate(itemsToCreate, {
        transaction,
      });

      // estoque: incrementando o currentStock (entrada)
      // Promise.all para executar todas as atualizações de forma paralela e eficiente
      const stockUpdates = itemsToCreate.map((item) => {
        return this.Product.increment(
          // coluna a ser incrementada
          { currentStock: item.quantity },
          // condições: onde o ID do produto corresponde ao item
          { where: { id: item.productId }, transaction },
        );
      });

      // espera que todas as atualizações de estoque sejam concluídas (dentro da transação)
      await Promise.all(stockUpdates);
      // fim da lógica de estoque

      await transaction.commit();

      return this.findById(newDonation.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll() {
    return await this.Donation.findAll({
      attributes: [
        'id',
        'dateTime',
        'observation',
        'donorId',
        'responsibleUserId',
        'campaignId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        // 1. INCLUSÃO DO DOADOR
        {
          association: 'donor',
          attributes: ['id', 'name', 'type', 'phone'], // Apenas campos essenciais do Doador
        },
        // 2. INCLUSÃO DO USUÁRIO RESPONSÁVEL
        {
          association: 'responsibleUser',
          attributes: ['id', 'name', 'role'],
        },
        // 3. INCLUSÃO DA CAMPANHA
        {
          association: 'campaign',
          attributes: ['id', 'name', 'startDate', 'endDate'], // Apenas campos essenciais da Campanha
        },
        // 4. INCLUSÃO DOS ITENS DA DOAÇÃO (DONATION_ITEM)
        {
          association: 'items',
          attributes: ['id', 'quantity', 'validity', 'productId'], // Apenas campos essenciais do Item
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

  // 'transaction = null' como parâmetro opcional
  async findById(id, transaction = null) {
    const donation = await this.Donation.findByPk(id, {
      attributes: [
        'id',
        'dateTime',
        'observation',
        'donorId',
        'responsibleUserId',
        'campaignId',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      include: [
        {
          association: 'donor',
          attributes: ['id', 'name', 'type', 'phone'],
        },
        {
          association: 'responsibleUser',
          attributes: ['id', 'name', 'role'],
        },
        {
          association: 'campaign',
          attributes: ['id', 'name', 'startDate', 'endDate'],
        },
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

      // passa o objeto transaction para o sequelize
      transaction,
    });

    if (!donation) {
      throw new NotFoundError(`Doação com ID ${id} não encontrada.`);
    }

    return donation;
  }

  // permite atualizar somente dados do cabeçalho da doação (observação, data)
  async update(id, data) {
    const { items, ...donationBaseData } = data; // filtra os itens
    const donation = await this.findById(id);

    if (donationBaseData.campaignId) {
      const newCampaignId = donationBaseData.campaignId;

      // se o id da campanha for diferente do atual (ou se a doação não tinha campanha)
      if (newCampaignId !== donation.campaignId) {
        const campaign = await this.Campaign.findByPk(newCampaignId);

        if (!campaign) {
          throw new NotFoundError(
            `Campanha com ID ${newCampaignId} não encontrada.`,
          );
        }

        // apenas permita a mudança se o status for inProgress
        if (campaign.status !== 'inProgress') {
          throw new BadRequestError(
            `Não é possível associar a doação à campanha "${campaign.name}". O status atual é "${campaign.status}".`,
          );
        }
      }
      // se a campanha for a mesma, não precisa validar o status, pois ela já foi validada na criação/associação anterior
    }

    await donation.update(donationBaseData);
    return donation;
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();

    try {
      // busca transacional: traz a doação com os itens e o currentStock do produto
      const donation = await this.findById(id, transaction);

      if (!donation) {
        throw new NotFoundError(`Doação com ID ${id} não encontrada.`);
      }

      // lógica de bloqueio: garante que há estoque suficiente para reverter a doação
      const itemsToRevert = donation.items;

      for (const item of itemsToRevert) {
        // o estoque atual do produto é acessado via inclusão (include)
        const availableStock = parseFloat(item.product.currentStock);
        const quantityToRevert = parseFloat(item.quantity);

        // se o estoque atual for menor que a quantidade a ser revertida, bloqueia
        if (availableStock < quantityToRevert) {
          // lança um erro que carrega o status 400
          throw new BadRequestError(
            `Não é possível excluir esta doação. Estoque insuficiente para reverter o item ${item.product.name}.`,
          );
        }
      }
      // fim da lógica de bloqueio

      // reversão de estoque (decremento)
      const stockUpdates = itemsToRevert.map((item) => {
        return this.Product.decrement(
          { currentStock: item.quantity },
          { where: { id: item.productId }, transaction },
        );
      });

      await Promise.all(stockUpdates);

      // destruição do registro (pai e filhos)
      await donation.destroy({ transaction });

      // commit e finalização
      await transaction.commit();

      return true;
    } catch (error) {
      // garante que a transação seja desfeita se a validação ou o decremento falhar
      await transaction.rollback();
      throw error;
    }
  }
}

export default DonationService;
