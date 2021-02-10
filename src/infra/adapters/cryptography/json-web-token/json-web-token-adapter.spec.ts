import { JsonWebTokenAdapter } from './json-web-token-adapter'
import jsonwebtoken from 'jsonwebtoken'

interface SutTypes {
  sut: JsonWebTokenAdapter,
  keySecret: string
}

const makeSut = (): SutTypes => {
  const keySecret = 'random_key'
  const sut = new JsonWebTokenAdapter(keySecret)
  return { sut, keySecret }
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
      const { sut, keySecret } = makeSut()
      const signSpy = jest.spyOn(jsonwebtoken, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, keySecret, { expiresIn: '2d' })
    })

    test('Should return a token when sign succeeds', async () => {
      const { sut } = makeSut()
      const token = await sut.encrypt('any_id')
      expect(token).toBe('any_token')
    })

    test('Should throw if sign method throws', async () => {
      const { sut } = makeSut()
      jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('#Verify', () => {
    test('Should call verify with correct values', async () => {
      const { sut, keySecret } = makeSut()
      const verifySpy = jest.spyOn(jsonwebtoken, 'verify')
      await sut.decrypt('token')
      expect(verifySpy).toHaveBeenCalledWith('token', keySecret)
    })

    test('Should return a value when verify succeeds', async () => {
      const { sut } = makeSut()
      const id = await sut.decrypt('token')
      expect(id).toBe('any_value')
    })
  })
})
