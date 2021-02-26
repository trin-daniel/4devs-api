import { AuthenticationService } from '@Data/Services/Account/Authentication/Authentication-Service'
import { Account } from '@Application/Entities'
import { AuthenticationDTO } from '@Application/DTOS'
import { Encrypter, HashCompare } from '@Data/Protocols/Cryptography'
import { LoadAccountByEmailRepository, UpdateTokenRepository } from '@Data/Protocols/Database/Account'

type SutTypes = {Sut: AuthenticationService, LoadAccountByEmailRepositoryStub: LoadAccountByEmailRepository, HashCompareStub: HashCompare, EncrypterStub: Encrypter, UpdateTokenRepositoryStub: UpdateTokenRepository}

const MockUpdateTokenRepository = (): UpdateTokenRepository => {
  class UpdateTokenRepositoryStub implements UpdateTokenRepository {
    async UpdateToken (id: string, token: string): Promise<void> {
      Promise.resolve()
    }
  }
  return new UpdateTokenRepositoryStub()
}

const MockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    public async Encrypt (value: string): Promise<string> {
      return Promise.resolve('token')
    }
  }
  return new EncrypterStub()
}

const MockHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async Compare (password: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}

const MockCredentials = (): AuthenticationDTO =>
  ({
    email: 'any_email@gmail.com',
    password: 'any_password'
  })

const MockAccount = (): Account =>
  ({
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  })

const MockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async LoadByEmail (data: string): Promise<Account> {
      return Promise.resolve(MockAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const UpdateTokenRepositoryStub = MockUpdateTokenRepository()
  const EncrypterStub = MockEncrypter()
  const HashCompareStub = MockHashCompare()
  const LoadAccountByEmailRepositoryStub = MockLoadAccountByEmailRepository()
  const Sut = new AuthenticationService(
    LoadAccountByEmailRepositoryStub,
    HashCompareStub,
    EncrypterStub,
    UpdateTokenRepositoryStub)
  return { Sut, LoadAccountByEmailRepositoryStub, HashCompareStub, EncrypterStub, UpdateTokenRepositoryStub }
}

describe('Authentication Service', () => {
  describe('#LoadAccountByEmailRepository', () => {
    test('Should call LoadAccountByEmailRepository with correct e-mail address', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail')
      const Data = MockCredentials()
      await Sut.Auth(Data)
      expect(loadByEmailSpy).toHaveBeenCalledWith(Data.email)
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = makeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
      const PromiseRejected = Sut.Auth(MockCredentials())
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = makeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockResolvedValueOnce(null)
      const Token = await Sut.Auth(MockCredentials())
      expect(Token).toBeNull()
    })
  })

  describe('#HashCompare', () => {
    test('Should call HashCompare with correct values', async () => {
      const { Sut, HashCompareStub } = makeSut()
      const CompareSpy = jest.spyOn(HashCompareStub, 'Compare')
      const Data = MockCredentials()
      await Sut.Auth(Data)
      expect(CompareSpy).toHaveBeenCalledWith(Data.password, 'hash')
    })

    test('Should throw if HashCompare throws', async () => {
      const { Sut, HashCompareStub } = makeSut()
      jest.spyOn(HashCompareStub, 'Compare').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Auth(MockCredentials())
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return null if HashCompare returns false', async () => {
      const { Sut, HashCompareStub } = makeSut()
      jest.spyOn(HashCompareStub, 'Compare').mockResolvedValueOnce(false)
      const Token = await Sut.Auth(MockCredentials())
      expect(Token).toBeNull()
    })
  })

  describe('#Encrypter', () => {
    test('Should call Encrypter with correct id', async () => {
      const { Sut, EncrypterStub } = makeSut()
      const EncryptSpy = jest.spyOn(EncrypterStub, 'Encrypt')
      const Account = MockAccount()
      await Sut.Auth(MockCredentials())
      expect(EncryptSpy).toHaveBeenCalledWith(Account.id)
    })

    test('Should throw if Encrypter throws', async () => {
      const { Sut, EncrypterStub } = makeSut()
      jest.spyOn(EncrypterStub, 'Encrypt').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Auth(MockCredentials())
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return a token on success', async () => {
      const { Sut } = makeSut()
      const Token = await Sut.Auth(MockCredentials())
      expect(Token).toEqual({ token: 'token', name: 'any_name' })
    })
  })

  describe('#UpdateTokenRepository', () => {
    test('Should call UpdateTokenRepository with correct values', async () => {
      const { Sut, UpdateTokenRepositoryStub } = makeSut()
      const UpdateTokenSpy = jest.spyOn(UpdateTokenRepositoryStub, 'UpdateToken')
      const Data = MockCredentials()
      const Account = MockAccount()
      await Sut.Auth(Data)
      expect(UpdateTokenSpy).toHaveBeenCalledWith(Account.id, 'token')
    })

    test('Should throw if UpdateTokenRepository throws', async () => {
      const { Sut, UpdateTokenRepositoryStub } = makeSut()
      jest.spyOn(UpdateTokenRepositoryStub, 'UpdateToken').mockRejectedValueOnce(new Error())
      const Data = MockCredentials()
      const PromiseRejected = Sut.Auth(Data)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
