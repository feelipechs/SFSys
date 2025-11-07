// classe base: serve para todos os erros que devem ter um código HTTP
export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// erro 404: recurso não encontrado
export class NotFoundError extends HttpError {
  constructor(message = 'Recurso não encontrado.') {
    super(message, 404);
  }
}

// erro 400: requisição inválida
export class BadRequestError extends HttpError {
  constructor(message = 'Requisição inválida. Verifique os dados enviados.') {
    super(message, 400);
  }
}

// erro 401: não autenticado
export class UnauthorizedError extends HttpError {
  constructor(
    message = 'Acesso não autorizado. Credenciais ausentes ou inválidas.',
  ) {
    super(message, 401);
  }
}

// erro 403: proibido
export class ForbiddenError extends HttpError {
  constructor(
    message = 'Acesso negado. Você não tem permissão para esta ação.',
  ) {
    super(message, 403);
  }
}
