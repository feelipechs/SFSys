import { DataTypes, Model } from 'sequelize';

class Donation extends Model {
  // Método estático de inicialização: Recebe a conexão como parâmetro
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        // Mapeamento snake_case para camelCase
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'date_time',
        },
        observation: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        // Foreign Keys (Mapeamento explícito para camelCase)
        donorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'donor_id',
        },
        responsibleUserId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'responsible_user_id',
        },
        campaignId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'campaign_id',
        },
      },
      {
        sequelize, // Usa a conexão passada no init
        tableName: 'donation',
        modelName: 'Donation',
        timestamps: true, // Se sua migration incluir created_at/updated_at
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // 1. A Doação pertence a um Doador (FK: donor_id)
    this.belongsTo(models.Donor, { foreignKey: 'donor_id', as: 'donor' });

    // 2. A Doação pertence a um User (FK: responsible_user_id)
    this.belongsTo(models.User, {
      foreignKey: 'responsible_user_id',
      as: 'responsibleUser',
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

export default Donation;
