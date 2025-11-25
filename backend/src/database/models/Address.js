import { Model, DataTypes } from 'sequelize';

class Address extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        cep: {
          type: DataTypes.STRING(8),
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING(2),
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        neighborhood: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        street: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        number: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        complement: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        latitude: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: true,
        },
        longitude: {
          type: DataTypes.DECIMAL(11, 8),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'address',
        underscored: true,
      },
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Beneficiary, {
      foreignKey: 'address_id',
      as: 'beneficiaries',
    });
  }

  // formatar o endereço completo
  getFullAddress() {
    const parts = [
      this.street,
      this.number && `nº ${this.number}`,
      this.complement,
      this.neighborhood,
      this.city,
      this.state,
      this.cep && `CEP: ${this.cep}`,
    ].filter(Boolean);

    return parts.join(', ');
  }
}

export default Address;
