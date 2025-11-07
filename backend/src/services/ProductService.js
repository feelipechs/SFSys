import { BadRequestError, NotFoundError } from '../utils/api-error.js';

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
    const { currentStock, ...productBaseData } = data;

    if (!productBaseData.name || !productBaseData.unitOfMeasurement) {
      throw new BadRequestError(
        'Todos os campos obrigatórios devem ser preenchidos.',
      );
    }

    try {
      const newProduct = await this.Product.create(productBaseData);
      return newProduct;
    } catch (error) {
      // capturar erro específico do sequelize para unicidade (Código 23505 no Postgres, 1062 no MySQL)
      if (
        error.name === 'SequelizeUniqueConstraintError' ||
        (error.parent && error.parent.code === '1062')
      ) {
        throw new BadRequestError(
          'Já existe um produto com este nome e unidade de medida. Verifique a unicidade.',
        );
      }
      // para todos os outros erros, relança o erro genérico
      throw error;
    }
  }

  async findAll() {
    return await this.Product.findAll({
      attributes: [
        'id',
        'name',
        'unitOfMeasurement',
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
        'currentStock',
        ['created_at', 'createdAt'],
        ['updated_at', 'updatedAt'],
      ],
    });

    if (!product) {
      throw new NotFoundError(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async update(id, data) {
    // filtra o currentStock para evitar que seja alterado manualmente
    const { currentStock, ...updateData } = data;

    // opcional: checar se há dados válidos para atualizar
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError(
        'Nenhum campo válido fornecido para atualização do produto.',
      );
    }

    const product = await this.findById(id);

    // validação de unicidade no ipdate: se nome ou unidade mudar, checar unicidade
    // (O Sequelize pode cuidar disso via Model/DB, mas uma checagem explícita aqui é mais amigável).

    await product.update(updateData);
    return product;
  }

  async delete(id) {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.findById(id, transaction);

      // checagem do histórico de doações
      const hasDonationHistory = await this.DonationItem.count({
        where: { productId: id },
        transaction,
      });

      // checagem do histórico de distribuições
      const hasDistributionHistory = await this.DistributionItem.count({
        where: { productId: id },
        transaction,
      });

      // bloqueio
      if (hasDonationHistory > 0 || hasDistributionHistory > 0) {
        throw new BadRequestError(
          'Não é possível excluir este produto. Ele está associado a doações ou distribuições históricas e deve ser mantido para auditoria.',
        );
      }

      // se não houver histórico, procede com a exclusão
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
