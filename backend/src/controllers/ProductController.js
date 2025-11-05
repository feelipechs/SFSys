class ProductController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  // POST /api/products
  async create(req, res) {
    try {
      const newProduct = await this.service.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Erro ao criar produto:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // GET /api/products
  async findAll(req, res) {
    try {
      const products = await this.service.findAll();
      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao listar produtos:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar lista.' });
    }
  }

  // GET /api/products/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.service.findById(id);
      return res.status(200).json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT /api/products/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await this.service.update(id, req.body);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE /api/products/:id
  async destroy(req, res) {
    try {
      const { id } = req.params;
      await this.service.destroy(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar produto:', error.message);
      return res.status(500).json({ error: error.message });
    }
  }
}

export default ProductController;
