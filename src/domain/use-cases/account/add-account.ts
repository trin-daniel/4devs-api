import { Account } from '../../entities'
import { AccountDTO } from '../../dtos'

export interface AddAccount {
  add (data: AccountDTO): Promise<Account>
}
