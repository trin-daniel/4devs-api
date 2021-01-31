import { Authentication } from '../../../../domain/use-cases/authentication/authentication'
import { AuthenticationDTO } from '../../../../domain/data-transfer-objects'
import { HashCompare, LoadAccountByEmailRepository } from '../../../contracts'

export class AuthenticationService implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare
  ) {}

  async auth (data: AuthenticationDTO): Promise<string> {
    const { email, password } = data
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (account) {
      await this.hashCompare.compare(password, account.password)
    }
    return null
  }
}
