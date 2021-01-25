export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized operation')
    this.name = 'UnauthorizedError'
  }
}
