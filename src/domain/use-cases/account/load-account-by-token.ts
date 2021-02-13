import { Account } from '@domain/entities'

export interface LoadAccountByToken {
  load (token: string, role?: string): Promise<Account>
}
