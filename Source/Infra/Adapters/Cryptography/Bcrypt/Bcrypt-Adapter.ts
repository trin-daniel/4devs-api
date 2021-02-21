import { HashCompare, Hasher } from '@Data/Protocols/Cryptography'
import { hash, compare } from 'bcrypt'

export class BcryptAdapter implements Hasher, HashCompare {
  constructor (
    private readonly Salt: number
  ) {}

  public async Hash (value: string): Promise<string> {
    const HashText = await hash(value, this.Salt)
    return HashText
  }

  public async Compare (password: string, hash: string): Promise<boolean> {
    const IsValid = await compare(password, hash)
    return IsValid
  }
}
