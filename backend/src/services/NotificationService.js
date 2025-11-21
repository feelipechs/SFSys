import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../utils/api-error.js';

class NotificationService {
  constructor(models) {
    if (!models || !models.Notification) {
      throw new Error(
        'O modelo Notification e a instância do Sequelize são obrigatórios para inicializar o Service.',
      );
    }

    this.Notification = models.Notification;
    this.sequelize = models.sequelize;
  }

  // busca todas as notif de um usuário
  async findAllByUser(userId) {
    if (!userId) {
      throw new BadRequestError('O ID do usuário é obrigatório.');
    }

    // busca e ordena da mais recente para a mais antiga
    const notifications = await this.Notification.findAll({
      where: { userId: userId },
      order: [['created_at', 'DESC']],
      limit: 50, // limite razoável para a página de notificações
      attributes: { exclude: ['user_id'] },
    });

    return notifications;
  }

  // marca uma notif como lida
  async markAsRead(id, userId) {
    // busca a notificação e verifica a propriedade (userId)
    const notification = await this.Notification.findOne({
      where: { id, userId: userId },
    });

    if (!notification) {
      // usa 404 para ocultar se a notificação existe mas pertence a outro
      throw new NotFoundError(`Notificação com ID ${id} não encontrada.`);
    }

    // atualiza se ainda não estiver lida
    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return notification;
  }

  // marca todas as notif como lida
  async markAllAsRead(userId) {
    if (!userId) {
      throw new BadRequestError('O ID do usuário é obrigatório.');
    }

    const [affectedRows] = await this.Notification.update(
      { isRead: true },
      { where: { userId: userId, isRead: false } },
    );

    return affectedRows;
  }

  // deleta uma notif
  async delete(id, userId) {
    const affectedRows = await this.Notification.destroy({
      where: { id, userId: userId },
    });

    if (affectedRows === 0) {
      throw new NotFoundError(
        `Notificação com ID ${id} não encontrada ou acesso negado.`,
      );
    }

    return;
  }

  // deleta todas as notif de um usuário
  async deleteAll(userId) {
    if (!userId) {
      throw new BadRequestError('O ID do usuário é obrigatório.');
    }

    const affectedRows = await this.Notification.destroy({
      where: { userId: userId },
    });

    return affectedRows;
  }

  // cria uma nova notif
  async createNotification(
    userId,
    title,
    message,
    type = 'default',
    sender = null,
  ) {
    if (!userId || !title || !message) {
      throw new BadRequestError('Dados de notificação incompletos.');
    }

    // adiciona o nome do remetente à mensagem, se fornecido
    const finalMessage = sender
      ? `${message} (Enviado por: ${sender.name || sender})`
      : message;

    const newNotification = await this.Notification.create({
      userId: userId,
      title,
      message: finalMessage,
      type,
      isRead: false,
    });

    return newNotification;
  }

  // envia uma notificação para uma lista de usuários
  async sendBulkNotification(
    recipientIds,
    title,
    message,
    sender,
    type = 'info',
  ) {
    if (!recipientIds || recipientIds.length === 0) {
      throw new BadRequestError('Nenhum destinatário selecionado.');
    }
    if (!title || !message) {
      throw new BadRequestError('Título e mensagem são obrigatórios.');
    }

    // apenas 'admin' e 'manager' podem enviar comunicados em massa
    if (sender.role !== 'admin' && sender.role !== 'manager') {
      throw new ForbiddenError(
        'Apenas gerentes e administradores podem enviar comunicados internos.',
      );
    }

    const transaction = await this.sequelize.transaction();

    try {
      // cria o objeto base da notificação
      const notificationData = {
        title: `Comunicado: ${title}`,
        message: `${message} (Enviado por: ${sender.name})`,
        type,
        isRead: false,
      };

      // cria uma lista de promise de criação para cada destinatário
      const createPromises = recipientIds.map((userId) => {
        // assegura que o userId seja o único campo variável
        return this.Notification.create(
          {
            ...notificationData,
            userId: userId,
          },
          { transaction },
        );
      });

      // executa todas as criações em paralelo (dentro da transação)
      await Promise.all(createPromises);

      await transaction.commit();

      return recipientIds.length;
    } catch (error) {
      await transaction.rollback();
      // se for um erro gerado por nós, propaga. Senão, trata como erro interno
      if (error.status) throw error;
      throw new Error(
        `Falha ao enviar notificações em massa: ${error.message}`,
      );
    }
  }
}

export default NotificationService;
