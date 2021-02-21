export interface HashCompare{
  Compare (password: string, hash: string): Promise<boolean>
}
