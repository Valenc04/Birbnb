import { AppError } from "./AppError.js";

export class NotFoundException extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class QueryParamsException extends AppError {
  constructor(message = 'QueryParams Invalidos') {
    super(message, 400);
  }
}

export class ValidationException extends AppError {
  constructor(message = 'Datos de validación inválidos') {
    super(message.toString(), 400);
  }
}

export class DoesNotBelongToUserException extends AppError {
  constructor(message = `El recurso existe pero el usuario no tiene los permisos para acceder`) {
    super(message, 403)
  }
}
export class AlreadyReadError extends AppError{
   constructor(notiId) {
        super(`Notification with ID ${notiId} has already been read`, )
    }
}

export class CreationException extends AppError {
  constructor(message = 'El recurso no se ha podido crear') {
    super(message, 400)
  }
}

export class ConflictException extends AppError {
  constructor(message = 'Conflicto con el recurso existente') {
    super(message, 409);
  }
} 

export class AlreadyExistsException extends AppError {
  constructor(message = `El recurso ya existe`) {
    super(message, 409);
  }
}