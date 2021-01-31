import { Authentication } from '../../../../domain/use-cases/authentication'
import { AuthenticationDTO } from '../../../../domain/data-transfer-objects'
import { LoadAccountByEmailRepository } from '../../../contracts'

export class AuthenticationService implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async auth (data: AuthenticationDTO): Promise<string> {
    const { email } = data
    await this.loadAccountByEmailRepository.loadByEmail(email)
    return null
  }
}
