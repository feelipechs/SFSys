class StatController {
  constructor(service) {
    this.service = service;

    this.getGlobalStats = this.getGlobalStats.bind(this);
    this.getDailyActivityTrend = this.getDailyActivityTrend.bind(this);
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

  async getGlobalStats(req, res) {
    try {
      const stats = await this.service.getGlobalStats();
      return res.status(200).json(stats);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  async getDailyActivityTrend(req, res) {
    try {
      // o método no service aceita opcionalmente o número de dias.
      // pode ler de req.query se quiser deixar o período dinâmico no futuro:
      // const days = req.query.days ? parseInt(req.query.days, 10) : 90;

      const days = req.query.days ? parseInt(req.query.days, 10) : 90;

      // 3. PAssa o parâmetro 'days' para o service
      const trendData = await this.service.getDailyActivityTrend(days);

      return res.status(200).json(trendData);
    } catch (error) {
      return this._handleError(res, error);
    }
  }
}

export default StatController;
