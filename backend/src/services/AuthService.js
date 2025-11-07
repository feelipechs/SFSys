import { UnauthorizedError, BadRequestError } from '../utils/api-error.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1h'; // expiram em 1 hora

class AuthService {
  // recebe apenas a Model User no construtor
  constructor(UserModel) {
    if (!UserModel) {
      throw new Error(
        'O modelo User é obrigatório para inicializar o AuthService.',
      );
    }
    this.User = UserModel;
  }

  async login(email, password) {
    if (!email || !password) {
      throw new BadRequestError('E-mail e senha são obrigatórios.');
    }

    // encontrar o usuário pelo email
    // precisamos buscar o campo 'password' explicitamente, pois o defaultScope o exclui!
    const user = await this.User.scope('defaultScope').findOne({
      where: { email },
      attributes: { include: ['password'] },
    });

    if (!user) {
      // mensagem genérica por segurança (não diz se o email existe ou se a senha está errada)
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    // comparar a senha (método da Model)
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    // geração do JWT (payload)
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role, // incluir a role é fundamental para o middleware de autorização
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    // retorno (remove a senha antes de enviar para o cliente)
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });

    return {
      user: userWithoutPassword,
      token: token,
    };
  }
}

export default AuthService;
