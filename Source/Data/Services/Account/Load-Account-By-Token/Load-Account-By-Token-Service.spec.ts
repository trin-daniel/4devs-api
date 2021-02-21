import { Account } from '@Application/Entities'
import { Decrypter } from '@Data/Protocols/Cryptography'
import { LoadAccountByTokenRepository } from '@Data/Protocols/Database'
import { LoadAccountByTokenService } from '@Data/Services/Account/Load-Account-By-Token/Load-Account-By-Token-Service'

type SutTypes = {Sut: LoadAccountByTokenService, DecrypterStub: Decrypter, LoadAccountByTokenRepositoryStub: LoadAccountByTokenRepository}

const MockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    Decrypt (value: string): Promise<string> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

const MockAccount = (): Account => (
  {
    id: '507f1f77bcf86cd799439011',
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'hash'
  }
)

const MockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    public async LoadByToken (token: string, role?: string): Promise<Account> {
      return Promise.resolve(MockAccount())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const LoadAccountByTokenRepositoryStub = MockLoadAccountByTokenRepository()
  const DecrypterStub = MockDecrypter()
  const Sut = new LoadAccountByTokenService(DecrypterStub, LoadAccountByTokenRepositoryStub)
  return { Sut, DecrypterStub, LoadAccountByTokenRepositoryStub }
}

describe('Load Account By Token Service', () => {
  describe('#Decrypter', () => {
    test('Should call Decrypter with correct token', async () => {
      const { Sut, DecrypterStub } = makeSut()
      const DecryptSpy = jest.spyOn(DecrypterStub, 'Decrypt')
      const Token = 'any_token'
      const Role = 'admin'
      await Sut.Load(Token, Role)
      expect(DecryptSpy).toHaveBeenCalledWith(Token)
    })

    test('Should return null if Decrypter returns null', async () => {
      const { Sut, DecrypterStub } = makeSut()
      jest.spyOn(DecrypterStub, 'Decrypt').mockResolvedValueOnce(null)
      const Token = 'any_token'
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toBeNull()
    })

    test('Should throw if Decrypter throws', async () => {
      const { Sut, DecrypterStub } = makeSut()
      jest.spyOn(DecrypterStub, 'Decrypt').mockRejectedValueOnce(new Error())
      const Token = 'any_token'
      const Role = 'admin'
      const PromiseRejected = Sut.Load(Token, Role)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })

  describe('#LoadAccountByTokenRepository', () => {
    test('Should call LoadAccountByTokenRepository with correct values', async () => {
      const { Sut, LoadAccountByTokenRepositoryStub } = makeSut()
      const LoadByTokenSpy = jest.spyOn(LoadAccountByTokenRepositoryStub, 'LoadByToken')
      const Token = 'any_token'
      const Role = 'admin'
      await Sut.Load(Token, Role)
      expect(LoadByTokenSpy).toHaveBeenCalledWith(Token, Role)
    })

    test('Should return null if LoadAccountByTokenRepository returns null', async () => {
      const { Sut, LoadAccountByTokenRepositoryStub } = makeSut()
      jest.spyOn(LoadAccountByTokenRepositoryStub, 'LoadByToken').mockResolvedValueOnce(null)
      const Token = 'any_token'
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toBeNull()
    })

    test('Should return an account on success', async () => {
      const { Sut } = makeSut()
      const Token = 'any_token'
      const Role = 'admin'
      const Account = await Sut.Load(Token, Role)
      expect(Account).toEqual(MockAccount())
    })

    test('Should throw if LoadAccountByTokenRepository throws', async () => {
      const { Sut, LoadAccountByTokenRepositoryStub } = makeSut()
      jest.spyOn(LoadAccountByTokenRepositoryStub, 'LoadByToken').mockRejectedValueOnce(new Error())
      const Token = 'any_token'
      const Role = 'admin'
      const PromiseRejected = Sut.Load(Token, Role)
      await expect(PromiseRejected).rejects.toThrow()
    })
  })
})
