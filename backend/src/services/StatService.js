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
  // usa métodos de data local para gerar YYYY-MM-DD
  _generateDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    // zera o tempo para garantir que a comparação e a data gerada sejam no fuso horário local
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // itera enquanto a data atual for menor ou igual à data final
    while (currentDate <= end) {
      // usa getFullYear(), getMonth(), getDate() para obter a data local
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // mês é zero-based (Jan=0)
      const day = String(currentDate.getDate()).padStart(2, '0');

      // formato YYYY-MM-DD (data pura, sem fuso horário)
      const formattedDate = `${year}-${month}-${day}`;
      dates.push(formattedDate);

      // avança para o próximo dia
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  _mergeDailyActivity(donations, distributions, startDate, endDate) {
    const map = {};

    // 1. Gera todas as datas no intervalo (e inicializa com zero)
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

    // retorna o array ordenado
    return Object.values(map);
  }

  async getDailyActivityTrend(days = 90) {
    const today = new Date();

    // o final do intervalo é o início do dia de hoje
    const endDate = new Date(today);
    endDate.setHours(0, 0, 0, 0); // ex: 2025-11-18 00:00:00 (local)

    // o início do intervalo é "days" dias atrás, no início daquele dia
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days); // ex: 2025-08-20 00:00:00 (local)

    // para a cláusula WHERE do Sequelize/SQL:
    // queremos dados de [startDate, até o final do dia de hoje]
    const sqlEndDate = new Date(endDate);
    sqlEndDate.setDate(sqlEndDate.getDate() + 1); // ex: 2025-11-19 00:00:00 (local)

    const whereClause = {
      created_at: {
        [this.Op.gte]: startDate,
        [this.Op.lt]: sqlEndDate, // menor que o início do dia seguinte
      },
    };

    // consulta 1: doações por dia
    // o DATE() do MySQL/Postgres extrai a data calendarizada do timestamp UTC, e o WHERE filtra corretamente o range de tempo
    const donations = await this.Donation.findAll({
      attributes: [
        [this.sequelize.fn('DATE', this.sequelize.col('created_at')), 'date'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      where: whereClause,
      group: [this.sequelize.fn('DATE', this.sequelize.col('created_at'))],
      raw: true,
    });

    // consulta 2: distribuições por dia
    const distributions = await this.Distribution.findAll({
      attributes: [
        [this.sequelize.fn('DATE', this.sequelize.col('created_at')), 'date'],
        [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
      ],
      where: whereClause,
      group: [this.sequelize.fn('DATE', this.sequelize.col('created_at'))],
      raw: true,
    });

    // o merge usa startDate (início do intervalo) e endDate (início do dia de hoje)
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
