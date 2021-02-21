import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'

export interface AddAccountUseCase {
  Add (data: AccountDTO): Promise<Account>
}
