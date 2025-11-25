class AddressController {
  constructor(addressService) {
    if (!addressService) {
      throw new Error(
        'AddressService é obrigatório para inicializar o Controller.',
      );
    }

    this.addressService = addressService;

    this.getByCep = this.getByCep.bind(this);
    this.findById = this.findById.bind(this);
    this.findAll = this.findAll.bind(this);
    this.update = this.update.bind(this);
  }

  async getByCep(req, res, next) {
    try {
      const { cep } = req.params;

      const addressData = await this.addressService.getByCep(cep);

      return res.status(200).json(addressData);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;

      const address = await this.addressService.findById(id);

      return res.status(200).json(address);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const addresses = await this.addressService.findAll();

      return res.status(200).json(addresses);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const updatedAddress = await this.addressService.update(id, data);

      return res.status(200).json(updatedAddress);
    } catch (error) {
      next(error);
    }
  }
}

export default AddressController;
