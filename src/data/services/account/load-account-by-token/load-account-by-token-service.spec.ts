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
      const role = 'admin'
      await sut.load(token, role)
      expect(decryptSpy).toHaveBeenCalledWith(token)
    })

    test('Should return null if Decrypter returns null', async () => {
      const { sut, decrypterStub } = makeSut()
      jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
      const token = 'any_token'
      const role = 'admin'
      const account = await sut.load(token, role)
      expect(account).toBeNull()
    })
  })
})
