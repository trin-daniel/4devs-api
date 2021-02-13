import { Account } from '@domain/entities'
import { AccountDTO } from '@domain/dtos'

export interface AddAccount {
  add (data: AccountDTO): Promise<Account>
}
