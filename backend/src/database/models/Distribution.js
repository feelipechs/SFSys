import { DataTypes, Model } from 'sequelize';

class Distribution extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        dateTime: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'date_time',
        },
        quantityBaskets: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'quantity_baskets',
        },
        observation: {
          type: DataTypes.TEXT,
          allowNull: true, // TEXT geralmente permite null, a menos que especificado
        },
        // foreign keys (mapeamento explícito para evitar conflito de nomes no JS)
        beneficiaryId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'beneficiary_id',
        },
        responsibleUserId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'responsible_user_id',
        },
      },
      {
        sequelize,
        tableName: 'distribution',
        modelName: 'Distribution',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
      },
    );
  }

  static associate(models) {
    // 1. A Distribuição PERTENCE A UM User (N:1)
    this.belongsTo(models.User, {
      foreignKey: 'responsible_user_id',
      as: 'responsibleUser',
    });

    // 2. A Distribuição PERTENCE A UM Beneficiário (N:1)
    this.belongsTo(models.Beneficiary, {
      foreignKey: 'beneficiary_id',
      as: 'beneficiary',
    });

    // 3. A Distribuição tem MUITOS Itens de Distribuição (1:N)
    this.hasMany(models.DistributionItem, {
      foreignKey: 'distribution_id',
      as: 'items',
    });
  }
}

export default Distribution;
