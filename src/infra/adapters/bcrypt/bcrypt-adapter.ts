import { Hasher } from '../../../data/contracts'
import { hash } from 'bcrypt'

export class BcryptAdapter implements Hasher {
  constructor (
    private readonly salt: number
  ) {}

  public async hash (value: string): Promise<string> {
    await hash(value, this.salt)
    return Promise.resolve(null)
  }
}
