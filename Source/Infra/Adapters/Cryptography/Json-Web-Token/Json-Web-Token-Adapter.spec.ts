import { JsonWebTokenAdapter } from '@Infra/Adapters/Cryptography/Json-Web-Token/Json-Web-Token-Adapter'
import Jsonwebtoken from 'jsonwebtoken'

type SutTypes = {Sut: JsonWebTokenAdapter, KEY_SECRET: string}

const makeSut = (): SutTypes => {
  const KEY_SECRET = 'random_key'
  const Sut = new JsonWebTokenAdapter(KEY_SECRET)
  return { Sut, KEY_SECRET }
}

jest.mock('jsonwebtoken', () => {
  return {
    async sign (): Promise<string> {
      return Promise.resolve('any_token')
    },
    async verify (): Promise<string> {
      return Promise.resolve('any_value')
    }
  }
})

describe('Json Web Token Adapter', () => {
  describe('#Sign', () => {
    test('Should call the sign method with correct values', async () => {
      const { Sut, KEY_SECRET } = makeSut()
      const SignSpy = jest.spyOn(Jsonwebtoken, 'sign')
      await Sut.Encrypt('any_id')
      expect(SignSpy).toHaveBeenCalledWith({ id: 'any_id' }, KEY_SECRET, { expiresIn: '2d' })
    })

    test('Should return a token when sign succeeds', async () => {
      const { Sut } = makeSut()
      const Token = await Sut.Encrypt('any_id')
      expect(Token).toBe('any_token')
    })

    test('Should throw if sign method throws', async () => {
      const { Sut } = makeSut()
      jest.spyOn(Jsonwebtoken, 'sign').mockImplementationOnce(() => { throw new Error() })
      const PromiseRejected = Sut.Encrypt('any_id')
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#Verify', () => {
    test('Should call verify with correct values', async () => {
      const { Sut, KEY_SECRET } = makeSut()
      const VerifySpy = jest.spyOn(Jsonwebtoken, 'verify')
      await Sut.Decrypt('token')
      expect(VerifySpy).toHaveBeenCalledWith('token', KEY_SECRET)
    })

    test('Should return a value when verify succeeds', async () => {
      const { Sut } = makeSut()
      const ID = await Sut.Decrypt('token')
      expect(ID).toBe('any_value')
    })

    test('Should throw if verify method throws', async () => {
      const { Sut } = makeSut()
      jest.spyOn(Jsonwebtoken, 'verify').mockImplementationOnce(() => { throw new Error() })
      const PromiseRejected = Sut.Decrypt('token')
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
