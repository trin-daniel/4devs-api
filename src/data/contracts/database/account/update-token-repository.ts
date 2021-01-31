export interface UpdateTokenRepository {
  updateToken (id: string, token: string): Promise<void>
}
