import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';

class StockService {
  constructor(models) {
    if (!models || !models.Product) {
      throw new Error('O modelo Product é obrigatório para o StockService.');
    }
    this.Product = models.Product;
  }

  /**
   * Adiciona uma quantidade ao estoque do produto (Entrada, Doação).
   * @param {number} productId O ID do produto.
   * @param {number} quantity A quantidade a ser adicionada.
   * @param {object} transaction A transação ativa do Sequelize (obrigatória).
   */
  async incrementStock(productId, quantity, transaction) {
    if (!transaction) {
      throw new Error(
        'Uma transação (transaction) é obrigatória para movimentação de estoque.',
      );
    }

    // incrementa o estoque. O Sequelize lida com a concorrência na coluna
    await this.Product.increment('current_stock', {
      by: quantity,
      where: { id: productId },
      transaction: transaction,
    });
    return true;
  }

  /**
   * Remove uma quantidade do estoque do produto (Saída, Distribuição) após verificação.
   * @param {number} productId O ID do produto.
   * @param {number} quantity A quantidade a ser removida.
   * @param {object} transaction A transação ativa do Sequelize (obrigatória).
   */
  async decrementStock(productId, quantity, transaction) {
    if (!transaction) {
      throw new Error(
        'Uma transação (transaction) é obrigatória para movimentação de estoque.',
      );
    }

    // bloqueia a linha para leitura e verifica o saldo
    const product = await this.Product.findByPk(productId, {
      attributes: ['name', 'currentStock'],
      // bloqueia a linha no db para que outro processo não altere o saldo antes do decremento
      lock: transaction.LOCK.UPDATE,
      transaction: transaction,
    });

    if (!product) {
      throw new NotFoundError(`Produto com ID ${productId} não encontrado.`);
    }

    if (product.currentStock < quantity) {
      throw new BadRequestError(
        `Não é possível excluir esta doação, pois o estoque do Produto "${product.name}" já foi consumido (${product.currentStock} disponíveis). O registro deve ser mantido para fins de auditoria.`,
      );
    }

    // decrementa o estoque
    await this.Product.decrement('current_stock', {
      by: quantity,
      where: { id: productId },
      transaction: transaction,
    });
    return true;
  }
}

export default StockService;
