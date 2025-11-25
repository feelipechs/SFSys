import { BadRequestError, NotFoundError } from '../utils/errorUtils.js';
import { fetchCep } from '../utils/brasilApiWrapper.js';

class AddressService {
  constructor(models) {
    if (!models || !models.Address || !models.sequelize) {
      throw new Error(
        'Modelo Address e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Address = models.Address;
    this.sequelize = models.sequelize;
  }

  async getByCep(cep) {
    try {
      const addressData = await fetchCep(cep);
      return addressData;
    } catch (error) {
      if (error.cause === 404) {
        throw new NotFoundError(error.message);
      }
      if (error.cause === 400) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async createOrFind(addressData, transaction = null) {
    // busca dados do CEP na BrasilAPI
    // se falhar aqui, o try/catch acima já tratou o erro
    const brasilAPIData = await this.getByCep(addressData.cep);

    const queryOptions = transaction ? { transaction } : {};

    // verifica se já existe um endereço idêntico
    const existingAddress = await this.Address.findOne({
      where: {
        cep: brasilAPIData.cep,
        street: brasilAPIData.street,
        number: addressData.number || null,
        complement: addressData.complement || null,
      },
      ...queryOptions,
    });

    if (existingAddress) {
      return existingAddress;
    }

    // cria novo endereço
    const newAddress = await this.Address.create(
      {
        ...brasilAPIData,
        number: addressData.number || null,
        complement: addressData.complement || null,
      },
      queryOptions,
    );

    return newAddress;
  }

  async findById(id) {
    const address = await this.Address.findByPk(id);

    if (!address) {
      throw new NotFoundError(`Endereço com ID ${id} não encontrado.`);
    }

    return address;
  }

  async update(id, data) {
    const address = await this.findById(id);

    // se o CEP mudou, busca novos dados
    if (data.cep && data.cep !== address.cep) {
      const newAddressData = await this.getByCep(data.cep);
      Object.assign(data, newAddressData);
    }

    await address.update(data);
    return address;
  }

  async findAll() {
    return await this.Address.findAll({
      order: [
        ['city', 'ASC'],
        ['street', 'ASC'],
      ],
    });
  }
}

export default AddressService;
