export class EmailInUseError extends Error {
  constructor () {
    super('The e-mail address already in use')
    this.name = 'EmailInUseError'
  }
}
