import { Op } from 'sequelize';

class StatService {
  constructor(models) {
    if (
      !models ||
      !models.User ||
      !models.Donation ||
      !models.Distribution ||
      !models.sequelize
    ) {
      throw new Error(
        'Os modelos (User, Donation, Distribution) e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.User = models.User;
    this.Donation = models.Donation;
    this.Distribution = models.Distribution;
    this.sequelize = models.sequelize;

    this.Op = Op;
  }

  async getGlobalStats() {
    // 1. Total de Doações Registradas (Todas)
    const totalDonations = await this.Donation.count({});

    // 2. Total de Distribuições Registradas (Todas)
    const totalDistributions = await this.Distribution.count({});

    // 3. Total de Usuários (Todos)
    const totalUsers = await this.User.count({});

    // 4. Total de Famílias Atendidas (IDs de Beneficiários ÚNICOS)
    // Se 1 Beneficiário = 1 Família, a contagem de únicos é mais precisa aqui
    const totalFamiliesAttended = await this.Distribution.count({
      distinct: true,
      col: 'beneficiaryId',
    });

    return {
      totalDonations,
      totalDistributions,
      totalUsers,
      totalFamiliesAttended,
    };
  }

  // método auxiliar para gerar todas as datas no intervalo
  _generateDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    // zera o tempo para garantir comparação correta
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // adiciona um dia extra ao final para garantir que o dia de término seja incluído
    end.setDate(end.getDate() + 1);

    while (currentDate < end) {
      const formattedDate = currentDate.toISOString().split('T')[0];
      dates.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  _mergeDailyActivity(donations, distributions, startDate, endDate) {
    // recebe as datas
    const map = {};

    // 1. Gera todas as datas no intervalo (e inicializa com zero)
    // startDate e endDate estão definidos e vindo do método chamador
    const dateRange = this._generateDateRange(startDate, endDate);

    dateRange.forEach((date) => {
      map[date] = {
        date: date,
        donations: 0,
        distributions: 0,
      };
    });

    // 2. Mescla os dados de Doações (apenas atualiza a contagem)
    donations.forEach((d) => {
      if (map[d.date]) {
        map[d.date].donations = parseInt(d.count, 10);
      }
    });

    // 3. Mescla os dados de Distribuições (apenas atualiza a contagem)
    distributions.forEach((di) => {
      if (map[di.date]) {
        map[di.date].distributions = parseInt(di.count, 10);
      }
    });

    // retorna o array ordenado (as datas já foram geradas em ordem)
    return Object.values(map);
  }

  async getDailyActivityTrend(days = 90) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);

    const endDate = new Date(today);

    // Consulta 1: Doações por dia
    const donations = await this.Donation.findAll({
      attributes: [
        [this.sequelize.fn('DATE', this.sequelize.col('created_at')), 'date'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      where: {
        created_at: { [this.Op.gte]: startDate },
      },
      group: [this.sequelize.fn('DATE', this.sequelize.col('created_at'))],
      raw: true,
    });

    // Consulta 2: Distribuições por dia
    const distributions = await this.Distribution.findAll({
      attributes: [
        [this.sequelize.fn('DATE', this.sequelize.col('created_at')), 'date'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      where: {
        created_at: { [this.Op.gte]: startDate },
      },
      group: [this.sequelize.fn('DATE', this.sequelize.col('created_at'))],
      raw: true,
    });

    // passando startDate e endDate para a função de merge
    const mergedData = this._mergeDailyActivity(
      donations,
      distributions,
      startDate,
      endDate,
    );
    return mergedData;
  }
}

export default StatService;
