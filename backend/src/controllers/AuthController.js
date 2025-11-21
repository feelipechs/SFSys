class AuthController {
  // recebe a instância do AuthService no construtor (injeção de dependência)
  constructor(service) {
    if (!service) {
      throw new Error(
        'O AuthService é obrigatório para inicializar o AuthController.',
      );
    }

    this.service = service;
    this.login = this.login.bind(this);
    this.refresh = this.refresh.bind(this);
    this.logout = this.logout.bind(this);
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

  // manipula a requisição POST /login
  // chama o AuthService para autenticar e gerar o JWT
  async login(req, res, next) {
    // receber dados
    const { email, password } = req.body;

    try {
      // chamar o serviço de autenticação
      const result = await this.service.login(email, password, res);

      // responder com status 200 OK
      // o resultado contém { user: {...}, token: '...' }
      return res.status(200).json({
        message: 'Autenticação bem-sucedida.',
        data: result, // { user, accessToken }
      });
    } catch (error) {
      // se houver erro (401 Unauthorized, 400 BadRequest), ele será capturado aqui e passado para o ,middleware de erros
      next(error);
    }
  }

  async refresh(req, res) {
    try {
      // pega o refresh token do cookie
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token ausente.');
      }

      const result = await this.service.refreshAccessToken(refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      return this._handleError(res, error);
    }
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        await this.service.logout(refreshToken);
      }

      // limpa o cookie
      res.clearCookie('refresh_token');
      return res.status(200).json({
        message: 'Logout realizado com sucesso.',
      });
    } catch (error) {
      return this._handleError(res, error);
    }
  }
}

export default AuthController;
