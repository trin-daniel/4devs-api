import { Account } from '@Application/Entities'
import { AuthenticationDTO } from '@Application/DTOS'
import { AuthenticationService } from '@Data/Services/Account/Authentication/Authentication-Service'
import { Encrypter, HashCompare } from '@Data/Protocols/Cryptography'
import { LoadAccountByEmailRepository, UpdateTokenRepository } from '@Data/Protocols/Database/Account'
import Faker from 'faker'

interface SutTypes {
  Sut: AuthenticationService,
  LoadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
  HashCompareStub: HashCompare,
  EncrypterStub: Encrypter,
  UpdateTokenRepositoryStub: UpdateTokenRepository
}
const EXPECTED_TOKEN = Faker.random.uuid()
const EXPECTED_HASH = Faker.random.uuid()
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
      return Promise.resolve(EXPECTED_TOKEN)
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

const MockAccount = (): Account =>
  (
    {
      id: Faker.random.uuid(),
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: EXPECTED_HASH
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccount()

const MockCredentials = (): AuthenticationDTO =>
  ({
    email: MOCK_ACCOUNT_INSTANCE.email,
    password: EXPECTED_HASH
  })
const MOCK_CREDENTIALS_INSTANCE = MockCredentials()

const MockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async LoadByEmail (data: string): Promise<Account> {
      return Promise.resolve(MOCK_ACCOUNT_INSTANCE)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const MakeSut = (): SutTypes => {
  const UpdateTokenRepositoryStub = MockUpdateTokenRepository()
  const EncrypterStub = MockEncrypter()
  const HashCompareStub = MockHashCompare()
  const LoadAccountByEmailRepositoryStub = MockLoadAccountByEmailRepository()
  const Sut = new AuthenticationService(
    LoadAccountByEmailRepositoryStub,
    HashCompareStub,
    EncrypterStub,
    UpdateTokenRepositoryStub)
  return {
    Sut,
    LoadAccountByEmailRepositoryStub,
    HashCompareStub,
    EncrypterStub,
    UpdateTokenRepositoryStub
  }
}

describe('Authentication Service', () => {
  describe('#LoadAccountByEmailRepository', () => {
    test('Should call LoadAccountByEmailRepository with correct e-mail address', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = MakeSut()
      const LoadByEmailSpy = jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail')
      await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(LoadByEmailSpy).toHaveBeenCalledWith(MOCK_CREDENTIALS_INSTANCE.email)
    })

    test('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = MakeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
      const PromiseRejected = Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return null if LoadAccountByEmailRepository returns null', async () => {
      const { Sut, LoadAccountByEmailRepositoryStub } = MakeSut()
      jest.spyOn(LoadAccountByEmailRepositoryStub, 'LoadByEmail').mockResolvedValueOnce(null)
      const Token = await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(Token).toBeNull()
    })
  })

  describe('#HashCompare', () => {
    test('Should call HashCompare with correct values', async () => {
      const { Sut, HashCompareStub } = MakeSut()
      const CompareSpy = jest.spyOn(HashCompareStub, 'Compare')
      await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(CompareSpy).toHaveBeenCalledWith(MOCK_CREDENTIALS_INSTANCE.password, EXPECTED_HASH)
    })

    test('Should throw if HashCompare throws', async () => {
      const { Sut, HashCompareStub } = MakeSut()
      jest.spyOn(HashCompareStub, 'Compare').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return null if HashCompare returns false', async () => {
      const { Sut, HashCompareStub } = MakeSut()
      jest.spyOn(HashCompareStub, 'Compare').mockResolvedValueOnce(false)
      const Token = await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(Token).toBeNull()
    })
  })

  describe('#Encrypter', () => {
    test('Should call Encrypter with correct id', async () => {
      const { Sut, EncrypterStub } = MakeSut()
      const EncryptSpy = jest.spyOn(EncrypterStub, 'Encrypt')
      const Account = MOCK_ACCOUNT_INSTANCE
      await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(EncryptSpy).toHaveBeenCalledWith(Account.id)
    })

    test('Should throw if Encrypter throws', async () => {
      const { Sut, EncrypterStub } = MakeSut()
      jest.spyOn(EncrypterStub, 'Encrypt').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      await expect(PromiseRejected).rejects.toThrow()
    })

    test('Should return a token on success', async () => {
      const { Sut } = MakeSut()
      const Token = await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(Token).toEqual({ token: EXPECTED_TOKEN, name: MOCK_ACCOUNT_INSTANCE.name })
    })
  })

  describe('#UpdateTokenRepository', () => {
    test('Should call UpdateTokenRepository with correct values', async () => {
      const { Sut, UpdateTokenRepositoryStub } = MakeSut()
      const UpdateTokenSpy = jest.spyOn(UpdateTokenRepositoryStub, 'UpdateToken')
      await Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      expect(UpdateTokenSpy).toHaveBeenCalledWith(MOCK_ACCOUNT_INSTANCE.id, EXPECTED_TOKEN)
    })

    test('Should throw if UpdateTokenRepository throws', async () => {
      const { Sut, UpdateTokenRepositoryStub } = MakeSut()
      jest.spyOn(UpdateTokenRepositoryStub, 'UpdateToken').mockRejectedValueOnce(new Error())
      const PromiseRejected = Sut.Auth(MOCK_CREDENTIALS_INSTANCE)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
