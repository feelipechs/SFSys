class ProductService {
  constructor(ProductModel) {
    if (!ProductModel) {
      throw new Error(
        'O modelo Product é obrigatório para inicializar o Service.',
      );
    }

    this.Product = ProductModel;
  }

  async create(data) {
    // desestruturar, filtrando 'currentStock' do payload de entrada
    const { currentStock, ...productBaseData } = data;

    if (!productBaseData.name || !productBaseData.unitOfMeasurement) {
      throw new Error('Todos os campos obrigatórios devem ser preenchidos.');
    }

    // criar o produto apenas com os dados base filtrados
    const newProduct = await this.Product.create(productBaseData);

    return newProduct;
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

  async findById(id) {
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
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async update(id, data) {
    const product = await this.findById(id);

    await product.update(data);
    return product;
  }

  async delete(id) {
    const product = await this.findById(id);

    await product.destroy();
    return true;
  }
}

export default ProductService;
