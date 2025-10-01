export class AppError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const BadRequest = (msg: string, code = "BAD_REQUEST") =>
  new AppError(400, code, msg);
export const Unauthorized = (msg: string, code = "UNAUTHORIZED") =>
  new AppError(401, code, msg);
export const Conflict = (msg: string, code = "CONFLICT") =>
  new AppError(409, code, msg);
