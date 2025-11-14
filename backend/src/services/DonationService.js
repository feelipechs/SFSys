import { BadRequestError, NotFoundError } from '../utils/api-error.js';

class DonationService {
  constructor(models, productService) {
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
    this.productService = productService;
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

      // mapeamento de 'items' para 'itemsToCreate' e injeção do ID
      const itemsToCreate = items.map((item) => ({
        // usa 'itemId' se este for o nome que vem do frontend (ItemRepeater), e mapea para 'product_id' ou 'productId' que o Sequelize espera
        productId: item.productId,
        quantity: item.quantity,
        validity: item.validity === '' ? null : item.validity,
        donationId: newDonation.id, // injeta o id do pai
      }));

      // criando os filhos em lote
      await this.DonationItem.bulkCreate(itemsToCreate, {
        transaction,
      });

      // usa o método centralizado do ProductService (INCREMENT)
      const stockUpdates = itemsToCreate.map((item) => {
        return this.productService.incrementStock(
          // usar 'item.productId' (que foi definido no mapeamento acima)
          item.productId,
          item.quantity,
          transaction,
        );
      });

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

    if (data.items) {
      // lança o erro se 'items' estiver presente (não importa se é array vazio ou não)
      throw new BadRequestError(
        'Não é permitido atualizar a lista de itens (produtos e quantidades) de uma doação existente. Apenas dados do cabeçalho (observação, data e campanha) podem ser modificados.',
      );
    }

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

    try {
      await donation.update(donationBaseData);
      return donation;
    } catch (error) {
      // se houver erros de validação do Sequelize (ex: formato de data, campo ausente),
      // ele será capturado aqui e lançado de volta ao controller.
      throw error;
    }
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();

    try {
      // busca transacional: traz a doação com os itens
      const donation = await this.findById(id, transaction);

      if (!donation) {
        throw new NotFoundError(`Doação com ID ${id} não encontrada.`);
      }

      const itemsToRevert = donation.items;

      // usa o método centralizado do ProductService (DECREMENT)
      // o método decrementStock já faz a checagem de saldo e o bloqueio da linha.
      const stockUpdates = itemsToRevert.map((item) => {
        return this.productService.decrementStock(
          item.productId, // id do Produto
          item.quantity, // quantidade a decrementar (reverter)
          transaction, // transação ativa
        );
      });

      await Promise.all(stockUpdates);

      // destruição do registro (pai e filhos)
      await donation.destroy({ transaction });

      // ... (commit e finalização)
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
