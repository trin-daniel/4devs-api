import { Account } from '@domain/entities'
import { AccountDTO } from '@domain/dtos'

export interface AddAccountRepository {
  add (data: AccountDTO): Promise<Account>
}
