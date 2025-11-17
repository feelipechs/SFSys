class DonationController {
  constructor(service) {
    this.service = service;

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  // função utilitária para tratamento de erro
  _handleError(res, error) {
    // obtém o status: usa error.status (400, 404, 403) ou 500 para erros não mapeados
    const statusCode = error.status || 500;

    // opcional: logar erros 500 para debug, mas não 4xx
    if (statusCode >= 500) {
      console.error(`Erro interno no servidor: ${error.message}`, error.stack);
    }

    // retorna a resposta HTTP correta
    return res.status(statusCode).json({
      message: error.message,
      status: statusCode, // opcional, informa o status no corpo
    });
  }

  // POST /api/donations
  async create(req, res) {
    try {
      // captura o ID do usuário logado da requisição
      const responsibleUserId = req.user.id;

      // cria o payload injetando o id do responsável
      let payload = {
        ...req.body,
        responsibleUserId: responsibleUserId,
      };

      // garante que o campo opcional seja NULL
      if (payload.campaignId === '') {
        payload.campaignId = null;
      }

      // chama o service com o payload completo
      const newDonation = await this.service.create(payload);
      return res.status(201).json(newDonation);
    } catch (error) {
      // usa o tratador de erro para BadRequest (400)
      return this._handleError(res, error);
    }
  }

  // GET /api/donations
  async findAll(req, res) {
    try {
      const donations = await this.service.findAll();
      return res.status(200).json(donations);
    } catch (error) {
      // usa o tratador de erro
      return this._handleError(res, error);
    }
  }

  // GET/api/donations/:id
  async findById(req, res) {
    try {
      const { id } = req.params;
      const donation = await this.service.findById(id);
      return res.status(200).json(donation);
    } catch (error) {
      // usa o tratador de erro para NotFound (404)
      return this._handleError(res, error);
    }
  }

  // PUT /api/donations/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedDonation = await this.service.update(id, req.body);
      return res.status(200).json(updatedDonation);
    } catch (error) {
      // usa o tratador de erro para NotFound (404), BadRequest (400)
      return this._handleError(res, error);
    }
  }

  // DELETE /api/donations/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error) {
      // usa o tratador de erro para NotFound (404), BadRequest (400 - ex: estoque insuficiente para reverter)
      return this._handleError(res, error);
    }
  }
}

export default DonationController;
