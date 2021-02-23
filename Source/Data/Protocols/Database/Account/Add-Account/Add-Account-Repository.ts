import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'

export interface AddAccountRepository {
  Add (data: AccountDTO): Promise<Account>
}
