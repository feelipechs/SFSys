import { Model, DataTypes } from 'sequelize';
import sequelize from '../connection.js';

class Donation extends Model {
  static associate(models) {
    // 1. A Doação pertence a um Doador (FK: donor_id)
    this.belongsTo(models.Donor, { foreignKey: 'donor_id', as: 'donor' });

    // 2. A Doação pertence a um Staff (FK: responsible_staff_id)
    this.belongsTo(models.Staff, {
      foreignKey: 'responsible_staff_id',
      as: 'responsibleStaff',
    });

    // 3. A Doação pertence a uma Campanha (FK: campaign_id)
    this.belongsTo(models.Campaign, {
      foreignKey: 'campaign_id',
      as: 'campaign',
    });

    // 4. A Doação tem MUITOS Itens de Doação (1:N)
    this.hasMany(models.DonationItem, {
      foreignKey: 'donation_id',
      as: 'items',
    });
  }
}

Donation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observation: {
      type: DataTypes.TEXT,
    },
    donor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responsible_staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    campaign_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // created_at e updated_at são incluídos automaticamente
  },
  {
    sequelize,
    tableName: 'donation', // nome da tabela usada na migration
    modelName: 'Donation',
  },
);

export default Donation;
