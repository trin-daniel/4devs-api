import { Authentication } from '../../../../domain/use-cases/authentication/authentication'
import { AuthenticationDTO } from '../../../../domain/data-transfer-objects'
import { Encrypter, HashCompare, LoadAccountByEmailRepository } from '../../../contracts'

export class AuthenticationService implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter
  ) {}

  async auth (data: AuthenticationDTO): Promise<string> {
    const { email, password } = data
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (account) {
      const isEqual = await this.hashCompare.compare(password, account.password)
      return isEqual
        ? this.encrypter.encrypt(account.id)
        : null
    }
    return null
  }
}
