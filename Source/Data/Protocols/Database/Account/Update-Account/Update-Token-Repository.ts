export interface UpdateTokenRepository {
  UpdateToken (id: string, token: string): Promise<void>
}
