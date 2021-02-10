import { Encrypter, Decrypter } from '../../../../data/contracts'
import { sign, verify } from 'jsonwebtoken'

export class JsonWebTokenAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly keySecret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const token = await sign({ id: value }, this.keySecret, { expiresIn: '2d' })
    return token
  }

  async decrypt (value: string): Promise<string> {
    const id = await verify(value, this.keySecret) as string
    return id
  }
}
