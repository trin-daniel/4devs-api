import { Account } from '../../entities'
import { AccountDTO } from '../../data-transfer-objects'

export interface AddAccount {
  add (data: AccountDTO): Promise<Account>
}
