import { HashCompare, Hasher } from '../../../../data/contracts'
import { hash, compare } from 'bcrypt'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (
    private readonly salt: number
  ) {}

  public async hash (value: string): Promise<string> {
    const hashText = await hash(value, this.salt)
    return hashText
  }

  public async compare (password: string, hash: string): Promise<boolean> {
    const isValid = await compare(password, hash)
    return isValid
  }
}
