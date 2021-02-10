import { LoadAccountByTokenService } from './load-account-by-token-service'
import { Decrypter, LoadAccountByTokenRepository } from '../../../contracts'
import { Account } from '../../../../domain/entities'

interface SutTypes {
  sut: LoadAccountByTokenService,
  decrypterStub: Decrypter,
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): Promise<string> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

const mockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    public async loadByToken (token: string, role?: string): Promise<Account> {
      return Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const decrypterStub = mockDecrypter()
  const sut = new LoadAccountByTokenService(decrypterStub, loadAccountByTokenRepositoryStub)
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
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

    test('Should throw if Decrypter throws', async () => {
      const { sut, decrypterStub } = makeSut()
      jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.reject(new Error()))
      const token = 'any_token'
      const role = 'admin'
      const promise = sut.load(token, role)
      await expect(promise).rejects.toThrow()
    })
  })
  describe('#LoadAccountByTokenRepository', () => {
    test('Should call LoadAccountByTokenRepository with correct values', async () => {
      const { sut, loadAccountByTokenRepositoryStub } = makeSut()
      const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      const token = 'any_token'
      const role = 'admin'
      await sut.load(token, role)
      expect(loadByTokenSpy).toHaveBeenCalledWith(token, role)
    })

    test('Should return null if LoadAccountByTokenRepository returns null', async () => {
      const { sut, loadAccountByTokenRepositoryStub } = makeSut()
      jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
      const token = 'any_token'
      const role = 'admin'
      const account = await sut.load(token, role)
      expect(account).toBeNull()
    })

    test('Should return an account on success', async () => {
      const { sut } = makeSut()
      const token = 'any_token'
      const role = 'admin'
      const account = await sut.load(token, role)
      expect(account).toEqual(mockAccount())
    })

    test('Should throw if LoadAccountByTokenRepository throws', async () => {
      const { sut, loadAccountByTokenRepositoryStub } = makeSut()
      jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
      const token = 'any_token'
      const role = 'admin'
      const promise = sut.load(token, role)
      await expect(promise).rejects.toThrow()
    })
  })
})
