class ProductController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  _handleError(res, error) {
    const statusCode = error.status || 500;

    if (statusCode >= 500) {
      console.error(`Erro interno no servidor: ${error.message}`, error.stack);
    }

    return res.status(statusCode).json({
      message: error.message,
      status: statusCode,
    });
  }

  // POST /api/products
  async create(req, res) {
    try {
      const newProduct = await this.service.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/products
  async findAll(req, res) {
    try {
      const products = await this.service.findAll();
      return res.status(200).json(products);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // GET /api/products/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const product = await this.service.findById(id);
      return res.status(200).json(product);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PUT /api/products/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await this.service.update(id, req.body);
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // DELETE /api/products/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      return this._handleError(res, error);
    }
  }
}

export default ProductController;
