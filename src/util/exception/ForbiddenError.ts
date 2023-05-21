export class ForbiddenError extends Error {
  message: string;
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 403;
  }
}
