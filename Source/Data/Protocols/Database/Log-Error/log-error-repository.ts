export interface LogErrorRepository {
  LogError (error: string): Promise<void>
}
