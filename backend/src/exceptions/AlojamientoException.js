import { AppError } from "./AppError.js";
export class AlojamientoQueryParamsInvalidException extends AppError {
  constructor(message) {
    super(message, 400);
  }
}