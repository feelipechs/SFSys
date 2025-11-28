import { DonationSpecification } from '../specifications/DonationSpecification.js';
import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';

class DonationService {
  constructor(models, stockService) {
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
    this.stockService = stockService;
    this.specification = new DonationSpecification(models);
  }

  async create(data) {
    const { items, ...donationBaseData } = data;

    await this.specification.checkCampaignStatusForDonation(
      donationBaseData.campaignId,
    );

    const transaction = await this.sequelize.transaction();

    try {
      const newDonation = await this.Donation.create(donationBaseData, {
        transaction,
      });

      const itemsToCreate = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        validity: item.validity === '' ? null : item.validity,
        donationId: newDonation.id,
      }));

      await this.DonationItem.bulkCreate(itemsToCreate, {
        transaction,
      });

      const stockUpdates = itemsToCreate.map((item) => {
        return this.stockService.incrementStock(
          item.productId,
          item.quantity,
          transaction,
        );
      });

      await Promise.all(stockUpdates);

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
    const { items, ...donationBaseData } = data; // items será ignorado
    const donation = await this.findById(id);

    if (
      donationBaseData.campaignId &&
      donationBaseData.campaignId !== donation.campaignId
    ) {
      await this.specification.checkCampaignStatusForDonation(
        donationBaseData.campaignId,
      );
    }

    try {
      await donation.update(donationBaseData);
      return donation;
    } catch (error) {
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

      // usa o método centralizado do StockService (DECREMENT)
      // o método decrementStock já faz a checagem de saldo e o bloqueio da linha
      const stockUpdates = itemsToRevert.map((item) => {
        return this.stockService.decrementStock(
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
