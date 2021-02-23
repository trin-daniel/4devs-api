import { Account } from '@Application/Entities'

export interface LoadAccountByEmailRepository {
  LoadByEmail (email: string): Promise<Account>
}
