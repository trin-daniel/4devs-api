import { Authentication } from '../../../../domain/use-cases/authentication/authentication'
import { AuthenticationDTO } from '../../../../domain/dtos'
import { Encrypter, HashCompare, LoadAccountByEmailRepository, UpdateTokenRepository } from '../../../contracts'

export class AuthenticationService implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) {}

  async auth (data: AuthenticationDTO): Promise<string> {
    const { email, password } = data
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (account) {
      const isEqual = await this.hashCompare.compare(password, account.password)
      if (isEqual) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateTokenRepository.updateToken(account.id, token)
        return token
      }
    }
    return null
  }
}
