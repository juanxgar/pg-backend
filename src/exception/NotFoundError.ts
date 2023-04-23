export class NotFoundError extends Error {
  message: string;
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
