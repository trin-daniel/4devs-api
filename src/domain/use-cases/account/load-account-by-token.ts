import { Account } from '../../entities'

export interface LoadAccountByToken {
  load (token: string, role?: string): Promise<Account>
}
