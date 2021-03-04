import { Account } from '@Application/Entities'
import { Decrypter } from '@Data/Protocols/Cryptography'
import { LoadAccountByTokenRepository } from '@Data/Protocols/Database/Account'
import { LoadAccountByTokenService } from '@Data/Services/Account/Load-Account-By-Token/Load-Account-By-Token-Service'
import Faker from 'faker'

interface SutTypes {
  Sut: LoadAccountByTokenService,
  DecrypterStub: Decrypter,
  LoadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const MockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    Decrypt (value: string): Promise<string> {
      return Promise.resolve('value')
    }
  }
  return new DecrypterStub()
}

const EXPECTED_TOKEN = Faker.random.uuid()
const EXPECTED_HASH = Faker.random.uuid()
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
const MockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements
  LoadAccountByTokenRepository {
    public async LoadByToken (token: string, role?: string): Promise<Account> {
      return Promise.resolve(MOCK_ACCOUNT_INSTANCE)
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const MakeSut = (): SutTypes => {
  const LoadAccountByTokenRepositoryStub = MockLoadAccountByTokenRepository()
  const DecrypterStub = MockDecrypter()
  const Sut = new LoadAccountByTokenService(
    DecrypterStub,
    LoadAccountByTokenRepositoryStub
  )
  return {
    Sut,
    DecrypterStub,
    LoadAccountByTokenRepositoryStub
  }
}

describe('Load Account By Token Service', () => {
  describe('#Decrypter', () => {
    test('Should call Decrypter with correct token', async () => {
      const { Sut, DecrypterStub } = MakeSut()
      const DecryptSpy = jest.spyOn(DecrypterStub, 'Decrypt')
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      await Sut.Load(Token, Role)
      expect(DecryptSpy).toHaveBeenCalledWith(Token)
    })

    test('Should return null if Decrypter returns null', async () => {
      const { Sut, DecrypterStub } = MakeSut()
      jest.spyOn(DecrypterStub, 'Decrypt').mockResolvedValueOnce(null)
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toBeNull()
    })

    test('Should return null if Decrypter throws', async () => {
      const { Sut, DecrypterStub } = MakeSut()
      jest.spyOn(DecrypterStub, 'Decrypt').mockRejectedValueOnce(new Error())
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toBeNull()
    })
  })

  describe('#LoadAccountByTokenRepository', () => {
    test('Should call LoadAccountByTokenRepository with correct values', async () => {
      const { Sut, LoadAccountByTokenRepositoryStub } = MakeSut()
      const LoadByTokenSpy = jest.spyOn(LoadAccountByTokenRepositoryStub, 'LoadByToken')
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      await Sut.Load(Token, Role)
      expect(LoadByTokenSpy).toHaveBeenCalledWith(Token, Role)
    })

    test('Should return null if LoadAccountByTokenRepository returns null', async () => {
      const { Sut, LoadAccountByTokenRepositoryStub } = MakeSut()
      jest.spyOn(LoadAccountByTokenRepositoryStub, 'LoadByToken').mockResolvedValueOnce(null)
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toBeNull()
    })

    test('Should return an account on success', async () => {
      const { Sut } = MakeSut()
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toEqual(MOCK_ACCOUNT_INSTANCE)
    })

    test('Should throw if LoadAccountByTokenRepository throws', async () => {
      const { Sut, LoadAccountByTokenRepositoryStub } = MakeSut()
      jest.spyOn(LoadAccountByTokenRepositoryStub, 'LoadByToken').mockRejectedValueOnce(new Error())
      const Token = EXPECTED_TOKEN
      const Role = 'admin'
      const PromiseRejected = Sut.Load(Token, Role)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
