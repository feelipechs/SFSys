class NotificationController {
  constructor(service) {
    if (!service) {
      throw new Error(
        'O NotificationService é obrigatório para inicializar o Controller.',
      );
    }
    this.service = service;

    this.findAll = this.findAll.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.sendBulk = this.sendBulk.bind(this);
  }

  _handleError(res, error) {
    const statusCode = error.status || 500;

    if (statusCode >= 500) {
      console.error(
        `Erro interno no servidor de Notificações: ${error.message}`,
        error.stack,
      );
    }

    return res.status(statusCode).json({
      message: error.message,
      status: statusCode,
    });
  }

  // GET /api/notifications
  async findAll(req, res) {
    try {
      // o id do usuário logado vem do middleware de autenticação (req.user)
      const userId = req.user.id;
      const notifications = await this.service.findAllByUser(userId);
      return res.status(200).json(notifications);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PATCH /api/notifications/read-all
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const affectedCount = await this.service.markAllAsRead(userId);

      return res.status(200).json({
        message: `${affectedCount} notificações marcadas como lidas.`,
        affectedCount,
      });
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // PATCH /api/notifications/:id/read
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await this.service.markAsRead(Number(id), userId);

      return res.status(200).json(notification);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // DELETE /api/notifications/:id
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await this.service.delete(Number(id), userId);

      return res.status(204).send();
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // DELETE /api/notifications/delete-all
  async deleteAll(req, res) {
    try {
      const userId = req.user.id;
      const affectedCount = await this.service.deleteAll(userId);

      return res.status(200).json({
        message: `${affectedCount} notificações deletadas.`,
        affectedCount,
      });
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  // POST /api/notifications/send-bulk
  async sendBulk(req, res) {
    try {
      // o editor/remetente é o usuário autenticado
      const sender = req.user;
      // os dados virão do corpo da requisição do formulário
      const { recipientIds, title, message, type } = req.body;

      const createdCount = await this.service.sendBulkNotification(
        recipientIds,
        title,
        message,
        sender,
        type,
      );

      return res.status(201).json({
        message: `${createdCount} notificações enviadas com sucesso.`,
        affectedCount: createdCount,
      });
    } catch (error) {
      return this._handleError(res, error);
    }
  }
}

export default NotificationController;
