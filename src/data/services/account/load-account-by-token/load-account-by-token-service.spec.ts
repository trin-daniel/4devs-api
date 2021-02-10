import { LoadAccountByTokenService } from './load-account-by-token-service'
import { Decrypter } from '../../../contracts'

interface SutTypes {
  sut: LoadAccountByTokenService,
  decrypterStub: Decrypter
}

const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): Promise<string> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const sut = new LoadAccountByTokenService(decrypterStub)
  return { sut, decrypterStub }
}

describe('Load Account By Token Service', () => {
  describe('#Decrypter', () => {
    test('Should call Decrypter with correct token', async () => {
      const { sut, decrypterStub } = makeSut()
      const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
      const token = 'any_token'
      await sut.load(token)
      expect(decryptSpy).toHaveBeenCalledWith(token)
    })
  })
})
