import jwt from 'jsonwebtoken';
import { ForbiddenError, UnauthorizedError } from '../utils/api-error.js';

// deve ser a mesma chave usada para assinar o JWT no AuthService
const JWT_SECRET = process.env.JWT_SECRET;

// middleware para verificar o token JWT e autenticar o usuário
// retorna 401 unauthorized se o token for inválido, ausente ou expirado
export const authenticate = (req, res, next) => {
  // obter o cabeçalho Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Token de autenticação ausente.'));
  }

  // o formato esperado é "Bearer <token>"
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(
      new UnauthorizedError('Formato de token inválido. Use: Bearer <token>.'),
    );
  }

  try {
    // verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // injetar dados do usuário na requisição
    // o payload deve ter { id, email, role } conforme service
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };

    // se tudo estiver correto, prosseguir para o próximo middleware/controller
    next();
  } catch (error) {
    // se a verificação falhar (chave errada, token expirado), retorna 401
    // o erro do JWT é capturado e transformado em 401
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Token de autenticação expirado.'));
    }
    return next(new UnauthorizedError('Token de autenticação inválido.'));
  }
};

export const authorize = (allowedRoles) => (req, res, next) => {
  // o middleware 'authenticate' deve ter sido executado e preenchido req.user
  if (!req.user || !req.user.role) {
    // isso não deve acontecer se 'authenticate' rodou, mas é um bom check de segurança
    return next(
      new UnauthorizedError('Usuário não autenticado ou sem função definida.'),
    );
  }

  // checar se a role do usuário está na lista de roles permitidas
  if (!allowedRoles.includes(req.user.role)) {
    // 403 forbidden: o usuário está logado, mas não tem permissão para esta ação
    return next(
      new ForbiddenError(
        'Acesso negado. Você não tem permissão para esta ação.',
      ),
    );
  }

  // permissão concedida
  next();
};
