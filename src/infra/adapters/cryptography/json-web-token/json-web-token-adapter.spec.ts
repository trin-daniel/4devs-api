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
    sign: (): string => {
      return 'any_token'
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
  })
})
