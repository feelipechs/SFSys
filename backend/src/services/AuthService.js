import { UnauthorizedError, BadRequestError } from '../utils/api-error.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION;

class AuthService {
  constructor(UserModel, RefreshTokenModel) {
    if (!UserModel || !RefreshTokenModel) {
      throw new Error(
        'Os modelos User e RefreshToken são obrigatórios para inicializar o AuthService.',
      );
    }
    this.User = UserModel;
    this.RefreshToken = RefreshTokenModel;
  }

  // gera access token
  _generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  // gera refresh token
  _generateRefreshToken(user) {
    const payload = { id: user.id };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    });
  }

  // calcula a data de expiração do refresh token
  _calculateRefreshTokenExpiry() {
    const match = REFRESH_TOKEN_EXPIRATION.match(/(\d+)([dhms])/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // padrão: 7 dias

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return new Date(Date.now() + value * multipliers[unit]);
  }

  async login(email, password, res) {
    if (!email || !password) {
      throw new BadRequestError('E-mail e senha são obrigatórios.');
    }

    const user = await this.User.scope('defaultScope').findOne({
      where: { email },
      attributes: { include: ['password'] },
    });

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    // gera ambos os tokens
    const accessToken = this._generateAccessToken(user);
    const refreshToken = this._generateRefreshToken(user);

    // salva o refresh token no banco
    await this.RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: this._calculateRefreshTokenExpiry(),
    });

    // envia o refresh token como cookie HttpOnly
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // só HTTPS em produção
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    const { password: _, ...userWithoutPassword } = user.get({ plain: true });

    return {
      user: userWithoutPassword,
      accessToken, // apenas o access token vai no body
      // refreshToken não vai no body, só no cookie
    };
  }

  // renovar o access token usando o refresh token
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token é obrigatório.');
    }

    try {
      // verifica o refresh token
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

      // busca no banco
      const storedToken = await this.RefreshToken.findOne({
        where: { token: refreshToken, userId: decoded.id },
      });

      if (!storedToken) {
        throw new UnauthorizedError('Refresh token inválido.');
      }

      // verifica se expirou
      if (storedToken.isExpired()) {
        await storedToken.destroy();
        throw new UnauthorizedError('Refresh token expirado.');
      }

      // busca o usuário
      const user = await this.User.findByPk(decoded.id);
      if (!user) {
        throw new UnauthorizedError('Usuário não encontrado.');
      }

      // gera novo access token
      const newAccessToken = this._generateAccessToken(user);

      return { accessToken: newAccessToken };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Refresh token inválido.');
      }
      throw error;
    }
  }

  // logout: remove o refresh token
  async logout(refreshToken) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token é obrigatório.');
    }

    const deleted = await this.RefreshToken.destroy({
      where: { token: refreshToken },
    });

    if (deleted === 0) {
      throw new UnauthorizedError('Refresh token não encontrado.');
    }

    return { message: 'Logout realizado com sucesso.' };
  }
}

export default AuthService;
