import { Account } from '../../../../domain/entities'
import { AccountDTO } from '../../../../domain/data-transfer-objects'

export interface AddAccountRepository {
  add (data: AccountDTO): Promise<Account>
}
