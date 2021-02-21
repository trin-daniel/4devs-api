import { Decrypter, Encrypter } from '@Data/Protocols/Cryptography'
import { sign, verify } from 'jsonwebtoken'

export class JsonWebTokenAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly KEY_SECRET: string
  ) {}

  async Encrypt (value: string): Promise<string> {
    const Token = await sign({ id: value }, this.KEY_SECRET, { expiresIn: '2d' })
    return Token
  }

  async Decrypt (value: string): Promise<string> {
    const ID = await verify(value, this.KEY_SECRET) as string
    return ID
  }
}
