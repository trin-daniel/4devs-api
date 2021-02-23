import { Account } from '@Application/Entities'

export interface LoadAccountByTokenRepository {
  LoadByToken (token: string, role?: string): Promise<Account>
}
