import { Account } from '@Application/Entities'

export interface LoadAccountByTokenUseCase {
  Load (token: string, role?: string): Promise<Account>
}
