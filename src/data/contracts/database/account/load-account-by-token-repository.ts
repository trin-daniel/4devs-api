import { Account } from '@domain/entities'

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<Account>
}
