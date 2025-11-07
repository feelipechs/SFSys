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
  }

  // manipula a requisição POST /login
  // chama o AuthService para autenticar e gerar o JWT
  async login(req, res, next) {
    // receber dados
    const { email, password } = req.body;

    try {
      // chamar o serviço de autenticação
      const result = await this.service.login(email, password);

      // responder com status 200 OK
      // o resultado contém { user: {...}, token: '...' }
      return res.status(200).json({
        message: 'Autenticação bem-sucedida.',
        data: result,
      });
    } catch (error) {
      // se houver erro (401 Unauthorized, 400 BadRequest), ele será capturado aqui e passado para o ,middleware de erros
      next(error);
    }
  }
}

export default AuthController;
