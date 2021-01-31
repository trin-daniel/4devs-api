import { Account } from '../../../../domain/entities'

export interface LoadAccountByEmailRepository {
  loadByEmail (email: string): Promise<Account>
}
