import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';

class ProductService {
  constructor(models) {
    if (
      !models ||
      !models.Product ||
      !models.DonationItem ||
      !models.DistributionItem ||
      !models.sequelize
    ) {
      throw new Error(
        'Modelos (Product, DonationItem, DistributionItem) e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Product = models.Product;
    this.DonationItem = models.DonationItem;
    this.DistributionItem = models.DistributionItem;
    this.sequelize = models.sequelize;
  }

  async create(data) {
    // filtrar currentStock para impedir alteração manual na criação
    const { currentStock, ...productBaseData } = data;

    if (
      !productBaseData.name ||
      !productBaseData.unitOfMeasurement ||
      !productBaseData.category
    ) {
      throw new BadRequestError(
        'Todos os campos obrigatórios devem ser preenchidos.',
      );
    }

    try {
      const newProduct = await this.Product.create(productBaseData);
      return newProduct;
    } catch (error) {
      // captura de erro de unicidade
      if (
        error.name === 'SequelizeUniqueConstraintError' ||
        (error.parent && error.parent.code === '1062')
      ) {
        throw new BadRequestError(
          'Já existe um produto com este nome e unidade de medida.',
        );
      }
      throw error;
    }
  }

  async findAll() {
    return await this.Product.findAll({
      attributes: [
        'id',
        'name',
        'unitOfMeasurement',
        'category',
        'currentStock',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
      order: [['name', 'ASC']],
    });
  }

  async findById(id, transaction = null) {
    const product = await this.Product.findByPk(id, {
      attributes: [
        'id',
        'name',
        'unitOfMeasurement',
        'category',
        'currentStock',
      ],
      transaction, // permite que a busca ocorra dentro de uma transação
    });

    if (!product) {
      throw new NotFoundError(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async update(id, data) {
    // filtrar currentStock para impedir alteração manual no update
    const { currentStock, ...updateData } = data;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError(
        'Nenhum campo válido fornecido para atualização do produto.',
      );
    }

    const product = await this.findById(id);

    try {
      await product.update(updateData);
      return product;
    } catch (error) {
      // captura de erro de unicidade (código omitido)
      if (
        error.name === 'SequelizeUniqueConstraintError' ||
        (error.parent && error.parent.code === '1062')
      ) {
        throw new BadRequestError(
          'Já existe outro produto com este nome e unidade de medida.',
        );
      }
      throw error;
    }
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.findById(id, transaction);

      // product_id e productId funcionam...
      const historyWhere = { product_id: id };

      const hasDonationHistory = await this.DonationItem.count({
        where: historyWhere,
        transaction,
      });
      const hasDistributionHistory = await this.DistributionItem.count({
        where: historyWhere,
        transaction,
      });

      if (hasDonationHistory > 0 || hasDistributionHistory > 0) {
        throw new BadRequestError(
          'Não é possível excluir este produto. Ele está associado a transações históricas e deve ser mantido para auditoria.',
        );
      }

      await product.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default ProductService;
