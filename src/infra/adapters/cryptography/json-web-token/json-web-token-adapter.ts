import { Encrypter } from '../../../../data/contracts'
import { sign } from 'jsonwebtoken'

export class JsonWebTokenAdapter implements Encrypter {
  constructor (
    private readonly keySecret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const token = sign({ id: value }, this.keySecret, { expiresIn: '2d' })
    return Promise.resolve(token)
  }
}
